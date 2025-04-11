const Job = require('../models/jobModel.js');

// GET all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new job
const createJob = async (req, res) => {
  const { company, position, status, link } = req.body;
  try {
    const newJob = await Job.create({ company, position, status, link });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE a job
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a job
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
};
