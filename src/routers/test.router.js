const { Router } = require("express");
const test_controller = require("../controllers/test.controller")
const router = Router();


router.route("/").get(test_controller.test);


module.exports = router;