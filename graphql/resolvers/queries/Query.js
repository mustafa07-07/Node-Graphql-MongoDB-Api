const userResolver = {
  Query: {
    User: (parent, args) => {
      return {
        username:"mustafa",
        createdAt:"05.05.2022"

      };
    },
  }
};
module.exports = { userResolver };
