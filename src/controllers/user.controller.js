const user = require("../models/user.model")

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

    const newUser = await user.create({ firstName, lastName, email, password })

    res.status(201).send({
      success: true,
      message: "User Created Successfully!",
      newUser,
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in Registration Controller!",
      success: false,
      error
    });
  }
}

module.exports = { register }