const JWT = require("jsonwebtoken");

const token = {
  generate: ({ username }, expiresIn) => {
    return JWT.sign({ username }, process.env.SECRET, { expiresIn });
  },
};

module.exports=token;