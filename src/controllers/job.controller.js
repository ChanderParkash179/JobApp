const Job = require("../models/job.model");
const jwt = require("../jwt/jwt.service");
const moongse = require("mongoose");
const moment = require("moment");

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

async function stats(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const user = jwt.getUser(token);

    const stats = await Job.aggregate([
      {
        $match: {
          createdBy: new moongse.Types.ObjectId(user._id)
        },
      },
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1
          },
        },
      }
    ]);

    let monthly_stats = await Job.aggregate([
      {
        $match: {
          createdBy: new moongse.Types.ObjectId(user._id)
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: {
            $sum: 1
          },
        },
      }
    ]);

    monthly_stats = monthly_stats.map((item) => {
      const { _id: { year, month }, count } = item;

      const date = moment().month(month - 1).year(year).format('MMM y');
      return { date, count }
    });

    res.status(200).json({
      stat_count: stats.length,
      status: {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        internship: stats.internship || 0,
      },
      monthly_stats,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in getting jobs by position!",
      success: false,
      error
    });
  }
}

async function search_sort(req, res) {

  try {
    const { status, workType, search, sort } = req.query;

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.getUser(token);

    const query = {
      createdBy: user._id
    }

    if (status && status !== "all") query.status = status;
    if (workType && workType !== "all") query.workType = workType;
    if (search) query.position = { $regex: search, $options: "i" };

    let result = await Job.find(query);

    if (sort === "latest") result = result.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "oldest") result = result.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === "a-z") result = result.sort((a, b) => a.position.localeCompare(b.position));
    if (sort === "A-Z") result = result.sort((a, b) => b.position.localeCompare(a.position));

    const jobs = result;

    return res.status(200).json({ count: jobs.length, jobs });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in search with status!",
      success: false,
      error
    });
  }
}

module.exports = {
  create,
  modify,
  cut,
  all,
  stats,
  search_sort,
  getJobsByPosition,
  getJobsByCompany,
}