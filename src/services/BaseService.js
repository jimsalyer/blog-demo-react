import axios from 'axios';

export default class BaseService {
  constructor(endpoint) {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = new URL(endpoint || '/', apiUrl);
    const user = JSON.parse(localStorage.getItem('state.user'));

    this.client = axios.create({
      baseURL: url.href,
      headers: {
        'X-Access-Token': user ? user.accessToken : '',
      },
    });
  }
}
