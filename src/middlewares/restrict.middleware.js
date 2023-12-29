const jwt = require("../jwt/jwt.service");

async function restrict(req, res, next) {

  const auth_header = req.headers.authorization;

  if (!auth_header || !auth_header.startsWith("Bearer")) return res.status(400).send({ success: false, message: "Authorization Failed!" })

  const token = auth_header.split(" ")[1];

  try {
    const user = jwt.getUser(token);
    req.user = { user };
    next();
  } catch (error) {
    res.status(400).send({ success: false, message: error });
  }
}

module.exports = { restrict }