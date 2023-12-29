const Job = require("../models/job.model");
const jwt = require("../jwt/jwt.service");

async function create(req, res) {
  try {

    const { company, position } = req.body;

    if (!company || !position) return res.status(400).send({ success: false, message: "Please provide all fields!" });

    const user = jwt.getUser(req.headers.authorization.split(" ")[1]);

    req.body.createdBy = user._id;

    const job = await Job.create(req.body);

    return res.status(201).json({ job });
  } catch (error) {
    res.status(400).send({
      message: "Error in creating job!",
      success: false,
      error
    });
  }
}

async function all(req, res) {
  try {
    const jobs = await Job.find({});
    if (!jobs) return res.status(404).json({ success: false, message: "No Jobs Available" })
    return res.status(201).json({ jobs });
  } catch (error) {
    res.status(400).send({
      message: "Error in listing jobs!",
      success: false,
      error
    });
  }
}

async function cut(req, res) {
  try {
    const { position } = req.body;

    const isExistJob = await Job.findOne({ position });

    if (!isExistJob) return res.status(404).send({ success: false, message: "No job available against the provided position!" })

    const deletedJob = await Job.deleteOne(isExistJob);

    return res.status(200).send({
      success: true,
      message: "User deleted successfully!",
      job: deletedJob,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in deleting jobs!",
      success: false,
      error
    });
  }
}

module.exports = { create, cut, all }