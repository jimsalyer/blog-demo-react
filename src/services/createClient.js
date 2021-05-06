import axios from 'axios';

export default function createClient(endpoint) {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const url = new URL(endpoint || '/', apiUrl);

  return axios.create({
    baseURL: url.href,
  });
}
