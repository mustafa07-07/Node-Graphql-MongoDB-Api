const { gql } = require("apollo-server");
const bcrypt = require("bcrypt");
const token = require("../helpers/token");
const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    users: [User!]!
  }
  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String
    password: String
  }

  type Mutation {
    create(data: CreateUserInput!): Token!
    login(data: LoginUserInput!): Token
  }
  input LoginUserInput {
    username: String!
    password: String!
  }

  input CreateUserInput {
    username: String!
    password: String!
  }
`;

const resolvers = {
  Query: {
    user: async (parent, args, { User }) => {
      return await User.findById(args.id);
    },
    users: async (parent, args, { User }) => {
      return await User.find({}).sort({ createdAt: "desc" });
    },
  },
  Mutation: {
    create: async (parent, { data: { username, password } }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Kullanıcı Zaten Kayıtlı");
      }
      const newUser= await new User({
        username,
        password,
      }).save();
      return {
        token: token.generate( newUser , "1h"),
        newUser:newUser
      };

    },
    login: async (parent, { data: { username, password } }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Kullanıcı Bulunamadı");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Şifre Hatalı");
      }
      return {
        token: token.generate(User, "1h"),
      };
    },
  },
};
module.exports = { typeDefs, resolvers };
