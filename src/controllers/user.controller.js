const user = require("../models/user.model");
const jwt = require("../jwt/jwt.service");
const bcrypt = require("bcryptjs");

async function get(req, res) {

  try {
    const email = req.params.email;
    const isExistUser = await user.findOne({ email });

    if (!isExistUser) return res.status(404).send({ success: false, message: "No user available against the provided email!" })

    return res.status(200).json({
      success: true,
      message: "User Founded Successfully against the provided email",
      user: {
        firstName: isExistUser.firstName,
        lastName: isExistUser.lastName,
        email: isExistUser.email,
        location: isExistUser.location
      }
    })
  } catch (error) {
    res.status(400).send({
      message: "Error in getting user!",
      success: false,
      error
    });
  }
}

async function list(req, res) {
  try {
    const users = await user.find({});

    if (!users) return res.status(404).send({ success: false, message: "No users available" })

    return res.status(200).send({
      success: true,
      message: "Available Users shown below!",
      users,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in getting users!",
      success: false,
      error
    });
  }
}

async function edit(req, res) {
  try {
    const param_email = req.params.email;
    const { firstName, lastName, password, location } = req.body;

    const isExistUser = await user.findOne({ email: param_email });

    if (!isExistUser) return res.status(404).send({ success: false, message: "No user available against the provided email!" })

    const hashedPassword = await bcrypt.hash(password, 10);

    isExistUser.firstName = firstName;
    isExistUser.lastName = lastName;
    isExistUser.email = param_email;
    isExistUser.password = hashedPassword;
    isExistUser.location = location;

    const updatedUser = await user.updateOne({ email: isExistUser.email }, { $set: isExistUser });

    const token = jwt.setUser(updatedUser);

    return res.status(201).send({
      success: true,
      message: "User updated successfully against provided email address",
      user: updatedUser,
      token,
    })
  } catch (error) {
    res.status(400).send({
      message: "Error in getting users!",
      success: false,
      error
    });
  }
}

async function remove(req, res) {
  try {
    const email = req.params.email;

    const isExistUser = await user.findOne({ email });

    if (!isExistUser) return res.status(404).send({ success: false, message: "No user available against the provided email!" })

    const deletedUser = await user.deleteOne(isExistUser);

    return res.status(200).send({
      success: true,
      message: "User deleted successfully!",
      user: deletedUser,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in getting users!",
      success: false,
      error
    });
  }
}

module.exports = { get, list, edit, remove }