import axios from 'axios';

// Configure Axios instance with base URL and default headers
const API_URL = 'http://localhost:3000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth API
export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: 'Job Seeker' | 'Recruiter';
  }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

// Resume API
export const resumeApi = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAll() {
    const response = await api.get('/resumes');
    return response.data;
  },

  async analyze(resumeId: string, jobId: string) {
    const response = await api.post('/resumes/analyze', { resumeId, jobId });
    return response.data;
  },

  async delete(resumeId: string) {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
  }
};

// Job API
export const jobApi = {
  async create(jobData: {
    title: string;
    description: string;
    location: string;
    skills: string[];
  }) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/jobs');
    return response.data;
  },

  async getById(jobId: string) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  async update(jobId: string, jobData: {
    title?: string;
    description?: string;
    location?: string;
    skills?: string[];
  }) {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  async delete(jobId: string) {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  }
};

// User Profile API
export const profileApi = {
  async get() {
    const response = await api.get('/profile');
    return response.data;
  },

  async update(profileData: {
    name?: string;
    phone?: string;
    address?: string;
  }) {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  async updateSkills(skills: string[]) {
    const response = await api.put('/profile/skills', { skills });
    return response.data;
  }
};

// Skill Analysis API
export const analysisApi = {
  async getSkillGaps() {
    const response = await api.get('/analysis/skill-gaps');
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/analysis/recommendations');
    return response.data;
  }
};
