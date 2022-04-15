const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { ApolloError } = require("apollo-server-express");

const jwt = require("jsonwebtoken");
const { user: User } = require("../models/index");
const resolvers = {
  Query: {
    async getAllUsers(_, __, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      const users = await User.findAll();
      return users;
    },
    async getUserById(_, { id }, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      const users = await User.findOne({ where: { id } });
      if (!users) throw new Error("No user");
      return users;
    },
    async login(_, { username, password }, { req, res }) {
      if (req.user) throw new Error("you are already signed in");
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) throw new Error("username or password is incorrect");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("username or password is incorrect");
        const token = jwt.sign({ id: user.id, username: user.username }, "mysecret", { expiresIn: "5h" });
        delete user.dataValues.password;
        req.user = user.dataValues;
        res
          .cookie("token", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true })
          .cookie("id", user.id, { maxAge: 5 * 60 * 60 * 1000, sameSite: "none", secure: true });
        return user;
      } catch (err) {
        throw new Error(err.message, 401);
      }
    },
    async getOnlyUsers(_, __, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      if (req.user.role === "user") throw new Error("only admins can access this route");
      try {
        const users = await User.findAll({
          where: {
            [Op.or]: [{ role: "admin" }, { role: "user" }],
          },
          attributes: ["id", "username", "email", "role", "createdAt"],
          order: sequelize.fn("field", sequelize.col("role"), "admin", "user"),
        });
        return users;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async getOnlyAdmins(_, __, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      if (req.user.role !== "superAdmin") throw new Error("only superAdmins can access this route");
      try {
        const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id", "username", "email", "createdAt"] });
        return admins;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },

    logout(_, __, { ___, res }) {
      res.cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "none", secure: true });
      res.cookie("id", "", { maxAge: 0, sameSite: "none", secure: true });
    },
  },
  Mutation: {
    async createUser(_, { email, username, password }, { req }) {
      try {
        if (!req.user) throw new Error("Not Authenticated");
        if (req.user.role === "user") throw new Error("only admins can create users");
        const hashed = await bcrypt.hash(password, 8);
        const user = await User.create({
          username: username,
          email: email,
          password: hashed,
          role: "user",
        });
        return user;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async createAdmin(_, args, { req }) {
      try {
        if (!req.user) throw new Error("Not Authenticated");
        if (req.user.role !== "superAdmin") throw new Error("only superAdmins can create admins");
        const hashed = await bcrypt.hash(args.password, 8);
        const user = await User.create({
          username: args.username,
          email: args.email,
          password: hashed,
          role: "admin",
        });
        return user;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async changePassword(_, { oldPassword, newPassword, confirmPassword }, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Old password is incorrect");
        if (newPassword !== confirmPassword) throw new Error("new password and confirm pssword should be the same");
        const hashed = await bcrypt.hash(newPassword, 8);
        await User.update({ password: hashed }, { where: { id: req.user.id } });
        return "Password Changed";
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async updateUser(_, { id, username, email }, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      if (req.user.role !== "superAdmin") throw new Error("only superAdmins can update users");
      try {
        if (username) {
          await User.update({ username }, { where: { id } });
        }
        if (email) {
          await User.update({ email }, { where: { id } });
        }
        return "User updated successfully";
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
    async deleteUser(_, { id }, { req }) {
      if (!req.user) throw new Error("Not Authenticated");
      if (req.user.role !== "superAdmin") throw new Error("only superAdmins can delete users");

      try {
        await User.destroy({ where: { id } });
        return "User deleted successfully";
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
};

module.exports = resolvers;
