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

    //validate response
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          localStorage.removeItem('access_token');

          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }
  return instance;
}
