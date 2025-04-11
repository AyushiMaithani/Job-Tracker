import axios from 'axios';

const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
    }
});

//job endpoints
export const getJobs=()=>api.get('/api/jobs');
export const createJob=(data)=>api.post('/api/jobs',data);
export const updateJob=(id,data)=>api.put(`/api/jobs/${id}`,data);
export const deleteJob=(id)=>api.delete(`/api/jobs/${id}`);
