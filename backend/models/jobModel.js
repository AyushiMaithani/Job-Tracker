const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  link: {
    type: String,
    required: true,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
