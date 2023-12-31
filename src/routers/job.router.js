const { Router } = require("express");
const { create, modify, cut, all, stats, getJobsByCompany, getJobsByPosition } = require("../controllers/job.controller");

const router = Router();

router.route("/").get(all);

router.route("/create").post(create);
router.route("/cut").post(cut);
router.route("/modify/:id").patch(modify);

router.route("/company/:company").get(getJobsByCompany);
router.route("/position/:position").get(getJobsByPosition);

router.route("/stats").get(stats);

module.exports = router;