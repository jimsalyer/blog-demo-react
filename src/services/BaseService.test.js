import mockedEnv from 'mocked-env';
import BaseService from './BaseService';

describe('BaseService', () => {
  describe('Initialization', () => {
    const apiUrl = 'http://www.example.com';
    let restoreEnv;

    beforeEach(() => {
      restoreEnv = mockedEnv({
        REACT_APP_API_URL: apiUrl,
      });
    });

    afterEach(() => {
      restoreEnv();
    });

    it('uses the value of the environment variable REACT_APP_API_URL as the base URL of the API', () => {
      const service = new BaseService('/test');

      expect(service.client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
    });

    it('uses a default value of "/" for the endpoint when it is not provided', () => {
      const service = new BaseService();

      expect(service.client.defaults.baseURL).toStrictEqual(`${apiUrl}/`);
    });

    it('uses a default value when the environment variable REACT_APP_API_URL is not set', () => {
      restoreEnv();
      restoreEnv = mockedEnv({
        REACT_APP_API_URL: undefined,
      });

      const service = new BaseService('test');

      expect(service.client.defaults.baseURL).toStrictEqual(
        `http://localhost:5000/test`
      );
    });

    it('adds the leading forward slash to the endpoint if it is not provided', () => {
      const service = new BaseService('test');

      expect(service.client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
    });

    it('does not add the leading forward slash to the endpoint if it is provided', () => {
      const service = new BaseService('/test');

      expect(service.client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
    });

    it("adds the current user's access token to the headers of the request", () => {
      const expectedAccessToken = 'testaccesstoken';

      const user = {
        accessToken: expectedAccessToken,
      };

      localStorage.setItem('state.user', JSON.stringify(user));

      const service = new BaseService('/test');

      expect(service.client.defaults.headers).toHaveProperty(
        'X-Access-Token',
        expectedAccessToken
      );

      localStorage.removeItem('state.user');
    });
  });

  describe('parsePageCount()', () => {
    function createHeaderLink(name, page, url = 'http://www.example.com') {
      return `<${url}?_page=${page}>; rel="${name}"`;
    }

    it('returns the value of the "_page" query string parameter in a specific URL of the link header of an HTTP response', () => {
      const expectedValue = 4;

      const actualValue = BaseService.parsePageCount({
        headers: {
          link: createHeaderLink('last', expectedValue),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the response is not provided, undefined or null', () => {
      const expectedValue = 1;

      let actualValue = BaseService.parsePageCount();
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount(undefined);
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount(null);
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the response has no link header or the link header is invalid', () => {
      const expectedValue = 1;

      let actualValue = BaseService.parsePageCount({});
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount({ notHeaders: {} });
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount({ headers: {} });
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount({
        headers: { notLink: 'notLinkValue' },
      });
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount({ headers: { link: true } });
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the link header does not contain a URL with a "rel" value of "last"', () => {
      const expectedValue = 1;

      const actualValue = BaseService.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('prev', 1),
            createHeaderLink('next', 3),
          ].join(','),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the link header contains an invalid URL with a "rel" value of "last"', () => {
      const expectedValue = 1;

      let actualValue = BaseService.parsePageCount({
        headers: {
          link: [createHeaderLink('first', 1), '<>; rel="last"'].join(','),
        },
      });
      expect(actualValue).toBe(expectedValue);

      actualValue = BaseService.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('last', 10, 'bad_url'),
          ].join(','),
        },
      });
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the URL with a "rel" value of "last" does not have the correct query string value', () => {
      const expectedValue = 1;

      const actualValue = BaseService.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('last', 10).replace('_page', 'pageIndex'),
          ].join(','),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });
  });

  describe('parseQueryString()', () => {
    it('converts a query string into an object', () => {
      const expectedValue = {
        firstName: 'John',
        lastName: 'Smith',
      };

      const actualValue = BaseService.parseQueryString(
        '?firstName=John&lastName=Smith'
      );

      expect(actualValue).toEqual(expectedValue);
    });

    it('parses booleans and numbers from applicable string values', () => {
      const expectedValue = {
        trueValue: true,
        falseValue: false,
        positiveValue: 9,
        negativeValue: -18,
      };

      const actualValue = BaseService.parseQueryString(
        '?trueValue=true&falseValue=false&positiveValue=9&negativeValue=-18'
      );

      expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('stringifyQueryParams()', () => {
    it('converts an object into a query string', () => {
      const expectedValue = 'firstName=John&lastName=Smith';

      const actualValue = BaseService.stringifyQueryParams({
        firstName: 'John',
        lastName: 'Smith',
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('skips empty strings and null values', () => {
      const expectedValue = 'age=23&firstName=John&lastName=Smith';

      const actualValue = BaseService.stringifyQueryParams({
        firstName: 'John',
        lastName: 'Smith',
        age: 23,
        birthDate: null,
        postalCode: '',
      });

      expect(actualValue).toBe(expectedValue);
    });
  });
});
