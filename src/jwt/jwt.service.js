const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '1d' }
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
