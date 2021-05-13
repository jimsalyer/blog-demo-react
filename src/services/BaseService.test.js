import MockAdapter from 'axios-mock-adapter';
import mockedEnv from 'mocked-env';
import { userStorageKey } from '../constants';
import BaseService from './BaseService';

describe('BaseService', () => {
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

  it("adds the current user's access token to the headers of the request", async () => {
    const expectedAccessToken = 'testaccesstoken';

    const user = {
      accessToken: expectedAccessToken,
    };

    localStorage.setItem(userStorageKey, JSON.stringify(user));

    const service = new BaseService('/test');

    const clientMock = new MockAdapter(service.client);
    let testConfig;

    clientMock.onGet('/').reply((config) => {
      testConfig = config;
      return [200, {}];
    });

    await service.client.get('/');

    expect(testConfig.headers).toHaveProperty(
      'X-Access-Token',
      expectedAccessToken
    );

    localStorage.removeItem(userStorageKey);
  });
});
