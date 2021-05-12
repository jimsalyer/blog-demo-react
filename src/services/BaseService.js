import axios from 'axios';
import queryString from 'query-string';

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

  static parsePageCount(response) {
    if (
      response &&
      response.headers &&
      typeof response.headers.link === 'string'
    ) {
      const links = response.headers.link.split(',');
      const lastLink = links.find((link) => link.includes('rel="last"'));

      if (lastLink) {
        try {
          const matches = /<([^>]+)>/.exec(lastLink);
          if (matches) {
            const url = new URL(matches[1]);
            const queryParams = BaseService.parseQueryString(url.search);

            if (queryParams._page > 0) {
              return queryParams._page;
            }
          }
        } catch {
          // Do nothing
        }
      }
    }
    return 1;
  }

  static parseQueryString(value) {
    return queryString.parse(value, {
      parseBooleans: true,
      parseNumbers: true,
    });
  }

  static stringifyQueryParams(value) {
    return queryString.stringify(value, {
      skipEmptyString: true,
      skipNull: true,
    });
  }
}
