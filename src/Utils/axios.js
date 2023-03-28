import axios from 'axios';

let instance;

export default function getAxiosInstance() {
  if (!instance) {
    let token = localStorage.getItem('access_token');

    if (!token) return axios;

    instance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return instance;
}
