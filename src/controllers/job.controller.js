const Job = require("../models/job.model");
const jwt = require("../jwt/jwt.service");

async function create(req, res) {
  try {

    const { company, position } = req.body;

    if (!company || !position) return res.status(400).send({ success: false, message: "Please provide all fields!" });

    const user = jwt.getUser(req.headers.authorization.split(" ")[1]);

    console.log(user);
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

async function modify(req, res) {
  try {
    const id = req.params.id;
    const { company, position } = req.body;

    if (!company || !position) return res.status(400).send({ success: false, message: "Please provide all fields!" });

    const job = await Job.findById(id);

    const user = jwt.getUser(req.headers.authorization.split(" ")[1]);

    job.position = position;
    job.company = company;
    job.createdBy = user._id;

    const updated = await Job.updateOne({ id: job._id }, { $set: job })

    return res.status(201).send({ job: updated });
  } catch (error) {
    res.status(400).send({
      message: "Error in modifing job!",
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
      message: "Job deleted successfully!",
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

async function getJobsByCompany(req, res) {
  try {
    const company = req.param.company;

    const job = Job.find({ company });

    if (!job) return res.status(400).send({ success: false, message: "No company available against the provided company name!" })

    return res.status(200).json({ jobs: job });
  } catch (error) {
    res.status(400).send({
      message: "Error in getting jobs by company!",
      success: false,
      error
    });
  }
}

async function getJobsByPosition(req, res) {
  try {
    const position = req.param.position;

    const job = Job.find({ position });

    if (!job) return res.status(400).send({ success: false, message: "No position available in any of the available company!" })

    return res.status(200).json({ jobs: job });
  } catch (error) {
    res.status(400).send({
      message: "Error in getting jobs by position!",
      success: false,
      error
    });
  }
}


module.exports = { create, modify, cut, all, getJobsByPosition, getJobsByCompany }