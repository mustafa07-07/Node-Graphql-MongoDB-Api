const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", function(next){
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch((err) => {});
});

module.exports = mongoose.model("User", UserSchema);
