const { ApolloServerPluginInlineTrace } = require("apollo-server-core");
const colors = require("colors");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphql/types/scheme");

const User = require("./Models/User");

const express = require("express");
const app = express();
require("dotenv").config();
const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers,
  context: {
    User,
  },
  plugins: [ApolloServerPluginInlineTrace()],
});


app.use((req,res,next)=>{
  const token=req.headers["authorization"];
  if(token && token!=='null'){
    console.log(token);
  }
  next();
})


mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("> Connected...".bgCyan))
  .catch((err) =>
    console.log(
      `> Error while connecting to mongoDB : ${err.message}`.underline.red
    )
  );

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
