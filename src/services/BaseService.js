import axios from 'axios';
import { userStorageKey } from '../constants';

export default class BaseService {
  constructor(endpoint) {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const url = new URL(endpoint || '/', apiUrl);

    this.client = axios.create({
      baseURL: url.href,
      transformRequest: [
        (data, headers) => {
          const user = JSON.parse(localStorage.getItem(userStorageKey));
          if (user) {
            // eslint-disable-next-line no-param-reassign
            headers['X-Access-Token'] = user.accessToken;
          }
          return data;
        },
        ...axios.defaults.transformRequest,
      ],
    });
  }
}
