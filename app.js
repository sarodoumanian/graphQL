const express = require("express");
const CookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const auth = require("./middleware/auth");

const typeDefs = require("./schema/TypeDefs");
const resolvers = require("./schema/Resolvers");

const app = express();
app.use(CookieParser());

app.use(auth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  graphiql: true,
  context: ({ req, res }) => {
    return {
      req,
      res,
    };
  },
});

const port = 3000;

server.start().then(() => {
  server.applyMiddleware({
    app,
    cors: {
      origin: ["https://studio.apollographql.com"],
      credentials: true,
    },
  });
  app.listen({ port }, () => console.log(`Server running at port: ${port}`));
});
