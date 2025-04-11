import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, Briefcase, Calendar, Link as LinkIcon, X } from 'lucide-react';

type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

interface JobApplication {
  _id: string; // comes from MongoDB
  company: string;
  position: string;
  status: Status;
  dateApplied: string;
  link: string;
}

const API_BASE_URL = 'http://localhost:8000/api/jobs'; 
function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<JobApplication, '_id'>>({
    company: '',
    position: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    link: '',
  });

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getjobs`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/createjob`, formData);
      setApplications([res.data, ...applications]);
      setShowForm(false);
      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        link: '',
      });
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/deletejob/${id}`);
      setApplications(applications.filter(app => app._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Status) => {
    try {
      const jobToUpdate = applications.find(app => app._id === id);
      if (!jobToUpdate) return;

      const res = await axios.put(`${API_BASE_URL}/updatejob/${id}`, {
        ...jobToUpdate,
        status: newStatus,
      });

      setApplications(applications.map(app => (app._id === id ? res.data : app)));
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const filteredApplications = applications.filter(app =>
    statusFilter === 'All' ? true : app.status === statusFilter
  );

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Job Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={20} />
            Add Application
          </button>
        </div>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Application</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                  <input
                    type="date"
                    required
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    required
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Application
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{application.company}</h3>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Briefcase size={16} />
                    {application.position}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-600 flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </p>
                    <a
                      href={application.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <LinkIcon size={16} />
                      View Job
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status]}`}>
                    {application.status}
                  </span>
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application._id, e.target.value as Status)}
                    className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => handleDelete(application._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found. Add your first job application!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
