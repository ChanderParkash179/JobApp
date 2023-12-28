const { Router } = require("express");
const auth = require("../controllers/user.controller");

const router = Router();

router.route("/signup").post(auth.register)

module.exports = router;