import { apiRequest } from "./queryClient";

export const api = {
  companies: {
    getAll: (search?: string) => {
      const url = search ? `/api/companies?search=${encodeURIComponent(search)}` : '/api/companies';
      return fetch(url, { credentials: 'include' }).then(res => res.json());
    },
    getById: (id: number) => fetch(`/api/companies/${id}`, { credentials: 'include' }).then(res => res.json()),
    create: (data: any) => apiRequest('/api/companies', { method: 'POST', body: data }).then(res => res.json()),
    update: (id: number, data: any) => apiRequest(`/api/companies/${id}`, { method: 'PUT', body: data }).then(res => res.json()),
    delete: (id: number) => apiRequest(`/api/companies/${id}`, { method: 'DELETE' }).then(res => res.json()),
  },
  

  
  hiredJobs: {
    getAll: () => fetch('/api/hired-jobs', { credentials: 'include' }).then(res => res.json()),
    create: (data: any) => apiRequest('/api/hired-jobs', { method: 'POST', body: data }).then(res => res.json()),
    update: (id: number, data: any) => apiRequest(`/api/hired-jobs/${id}`, { method: 'PUT', body: data }).then(res => res.json()),
    delete: (id: number) => apiRequest(`/api/hired-jobs/${id}`, { method: 'DELETE' }).then(res => res.json()),
  },
  
  courses: {
    getAll: () => fetch('/api/courses', { credentials: 'include' }).then(res => res.json()),
    getUserProgress: () => fetch('/api/user/course-progress', { credentials: 'include' }).then(res => res.json()),
  },
  
  user: {
    getStats: () => fetch('/api/user/stats', { credentials: 'include' }).then(res => res.json()),
  },
  
  weather: {
    getCurrent: () => fetch('/api/weather', { credentials: 'include' }).then(res => res.json()),
  },
};
