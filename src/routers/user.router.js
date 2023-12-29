const { Router } = require("express");
const user_controller = require("../controllers/user.controller")
const router = Router();

router.route("/").get(user_controller.list);

router.route("/:email").get(user_controller.get).patch(user_controller.edit).delete(user_controller.remove);


module.exports = router;