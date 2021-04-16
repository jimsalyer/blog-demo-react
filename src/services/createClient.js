import axios from 'axios';

export default function createClient(endpoint) {
  const url = new URL(endpoint, process.env.API_URL);
  return axios.create({
    baseURL: url.href,
  });
}
