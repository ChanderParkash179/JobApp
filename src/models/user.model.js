const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is Required!"],
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    validate: validator.isEmail,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
    minlength: [6, "Password length should be greator than 6 characters!"]
  },
  location: {
    type: String,
    default: "Pakistan"
  }
}, { timestamps: true });

const user = mongoose.model("user", userSchema);

module.exports = user;
