const { Router } = require("express");
const jobs = require("../controllers/job.controller");

const router = Router();

router.route("/").get(jobs.all);

router.route("/create").post(jobs.create);
router.route("/cut").post(jobs.cut);
router.route("/modify/:id").patch(jobs.modify);

router.route("/company/:company").get(jobs.getJobsByCompany);
router.route("/position/:position").get(jobs.getJobsByPosition);

router.route("/stats").get(jobs.stats);

router.route("/search/sort/").get(jobs.search_sort);

module.exports = router;