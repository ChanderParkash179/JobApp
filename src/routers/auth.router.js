const { Router } = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = Router();

router.route("/signup").post(register)
router.route("/signin").post(login)

module.exports = router;