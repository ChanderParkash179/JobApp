const user = require("../models/user.model");
const jwt = require("../jwt/jwt.service")
const bcrypt = require("bcryptjs");

async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) return res.status(400).send({ success: false, message: "Please provide First Name!" });
    if (!lastName) return res.status(400).send({ success: false, message: "Please provide Last Name!" });
    if (!email) return res.status(400).send({ success: false, message: "Please provide Email!" });
    if (!password) return res.status(400).send({ success: false, message: "Please provide Password!" });

    const existingUser = await user.findOne({ email });

    if (existingUser) return res.status(200).send({
      success: false,
      message: "Email Already Register Please Login!"
    });

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({ firstName, lastName, email, password: hashedPassword })

    const token = jwt.setUser(newUser);

    res.status(201).send({
      success: true,
      message: "User Created Successfully!",
      newUser: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        location: newUser.location,
      },
      token
    })
  } catch (error) {
    res.status(400).send({
      message: "Error in Registration Controller!",
      success: false,
      error
    });
  }
}

async function login(req, res) {

  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ success: false, message: "please provide valid email or password!" });

    const existingUser = await user.findOne({ email });

    if (!existingUser) return res.status(404).send({ success: false, message: "Invalid user credentials!" })

    const compare = await bcrypt.compare(password, existingUser.password);

    if (!compare) return res.status(400).send({ success: false, message: "Invalid password entered!" })

    const accessToken = jwt.setUser(existingUser);
    return res.status(200).send({ user: { firstName: existingUser.firstName, lastName: existingUser.lastName, email: existingUser.email, location: existingUser.location }, token: accessToken });

  } catch (error) {
    res.status(400).send({
      message: "Error in Registration Controller!",
      success: false,
      error
    });
  }
}

module.exports = { register, login }