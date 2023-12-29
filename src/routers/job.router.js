const { Router } = require("express");
const { create, cut, all } = require("../controllers/job.controller");

const router = Router();

router.route("/").get(all);

router.route("/create").post(create);
router.route("/cut").post(cut);

module.exports = router;