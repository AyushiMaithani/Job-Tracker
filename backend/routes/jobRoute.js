const express = require('express');
const {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController.js');

const router = express.Router();

router.get('/getjobs', getAllJobs);
router.post('/createjob', createJob);
router.put('/updatejob/:id', updateJob);
router.delete('/deletejob/:id', deleteJob);

module.exports = router;
