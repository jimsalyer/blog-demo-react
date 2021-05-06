import mockedEnv from 'mocked-env';
import createClient from '../createClient';

describe('createClient()', () => {
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
    const client = createClient('test');

    expect(client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
  });

  it('uses a default value of "/" for the endpoint when it is not provided', () => {
    const client = createClient();

    expect(client.defaults.baseURL).toStrictEqual(`${apiUrl}/`);
  });

  it('uses a default value when the environment variable REACT_APP_API_URL is not set', () => {
    restoreEnv();
    restoreEnv = mockedEnv({
      REACT_APP_API_URL: undefined,
    });

    const client = createClient('test');

    expect(client.defaults.baseURL).toStrictEqual(`http://localhost:5000/test`);
  });

  it('adds the leading forward slash to the endpoint if it is not provided', () => {
    const client = createClient('test');

    expect(client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
  });

  it('does not add the leading forward slash to the endpoint if it is provided', () => {
    const client = createClient('/test');

    expect(client.defaults.baseURL).toStrictEqual(`${apiUrl}/test`);
  });
});
