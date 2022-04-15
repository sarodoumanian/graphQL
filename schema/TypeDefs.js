const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: String!
    username: String!
    email: String!
    password: String!
    role: String!
    createdAt: String!
  }

  type Query {
    getAllUsers: [User!]!
    getUserById(id: String!): User!
    getOnlyUsers: [User!]!
    getOnlyAdmins: [User!]!
    login(username: String!, password: String!): User!
    logout: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createAdmin(username: String!, email: String!, password: String!): User!
    changePassword(oldPassword: String!, newPassword: String!, confirmPassword: String!): String!
    updateUser(id: String!, username: String, email: String): String!
    deleteUser(id: String!): String!
  }
`;

module.exports = typeDefs;
