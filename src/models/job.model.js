const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company is Required!"]
  },
  position: {
    type: String,
    required: [true, "Job Position is Required!"],
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ['pending', 'reject', 'interview'],
    default: 'pending'
  },
  workType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    default: 'full-time'
  },
  workLocation: {
    type: String,
    default: "Karachi",
    required: [true, "Work Location is Required!"]
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  }
}, { timestamps: true });

const job = mongoose.model("job", jobSchema);

module.exports = job;