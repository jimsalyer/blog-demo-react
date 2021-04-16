import axios from 'axios';

export default function createClient(endpoint) {
  const url = new URL(endpoint, process.env.REACT_APP_API_URL);
  return axios.create({
    baseURL: url.href,
  });
}
