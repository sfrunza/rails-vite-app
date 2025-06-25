import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network error: Please check your connection.');
      return Promise.reject(error);
    }

    const { status } = error.response;

    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      // Maybe redirect to login or dispatch logout()
    } else if (status === 403) {
      toast.error('You do not have access to this resource.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export { api };

