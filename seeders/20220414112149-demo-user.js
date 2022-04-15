"use strict";
const { v4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        id: v4(),
        username: "sarodoumanian",
        email: "saro@doumanian.com",
        password: "$2b$08$yve49JZpGZKk6YROEMNedOpy0IC4/ok3bIy5iAs6OANUcihk5jqqm",
        role: "superAdmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        username: "raffibzdigian",
        email: "raffi@bzdigian.com",
        password: "$2b$08$J4a5ngkBREIOuZlw7YaThepcDNFedbnC0vtMrQqDVHws99j.aqTn.",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        username: "user1",
        email: "user1@user.com",
        password: "$2b$08$yve49JZpGZKk6YROEMNedOpy0IC4/ok3bIy5iAs6OANUcihk5jqqm",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        username: "user2",
        email: "user2@user.com",
        password: "$2b$08$yve49JZpGZKk6YROEMNedOpy0IC4/ok3bIy5iAs6OANUcihk5jqqm",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: v4(),
        username: "user3",
        email: "user3@user.com",
        password: "$2b$08$yve49JZpGZKk6YROEMNedOpy0IC4/ok3bIy5iAs6OANUcihk5jqqm",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
