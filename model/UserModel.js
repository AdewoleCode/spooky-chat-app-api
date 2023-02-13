const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide name"],
    maxlength: 40,
    minlength: 4,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "please provide name"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: [6, "password length must be more than 6 characters"],
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: ""
  },
})

userSchema.pre("save", async function (next) {

  if(!this.isModified('password')){
    return next()
  }


  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



module.exports = mongoose.model("User", userSchema);
