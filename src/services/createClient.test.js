import axios, { apiUrl } from 'axios';
import createClient from './createClient';

describe('createClient()', () => {
  let createSpy;

  beforeAll(() => {
    createSpy = jest.spyOn(axios, 'create');
  });

  it('adds the leading forward slash to the endpoint if it is not provided', () => {
    const endpoint = 'test';

    createClient(endpoint);

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: `${apiUrl}/${endpoint}`,
    });
  });

  it('does not add the leading forward slash to the endpoint if it is provided', () => {
    const endpoint = '/test';

    createClient(endpoint);

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: `${apiUrl}${endpoint}`,
    });
  });
});
