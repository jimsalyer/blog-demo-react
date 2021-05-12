import axios from 'axios';
import AuthService from './AuthService';

describe('AuthService', () => {
  let createSpy;
  let postSpy;
  let service;

  beforeEach(() => {
    const client = axios.create();
    postSpy = jest.spyOn(client, 'post');

    createSpy = jest.spyOn(axios, 'create').mockImplementation((config) => {
      client.defaults = {
        ...client.defaults,
        config,
      };
      return client;
    });
    service = new AuthService();
  });

  afterEach(() => {
    postSpy.mockRestore();
    createSpy.mockRestore();
  });

  describe('login()', () => {
    it('makes a POST request to the login endpoint with the given username, password, and "Remember Me" value and returns the result', async () => {
      const expectedUser = {
        id: 1,
        username: 'tuser',
        password: 'p@ssw0rd',
      };

      const expectedBody = {
        username: expectedUser.username,
        password: expectedUser.password,
        remember: true,
      };

      postSpy.mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await service.login(
        expectedUser.username,
        expectedUser.password,
        expectedBody.remember
      );

      expect(postSpy).toHaveBeenCalledWith('/login', expectedBody);
      expect(actualUser).toStrictEqual(expectedUser);
    });
  });

  describe('logout()', () => {
    it('makes a POST request to the logout endpoint', async () => {
      postSpy.mockResolvedValue({});

      await service.logout();

      expect(postSpy).toHaveBeenCalledWith('/logout');
    });
  });
});
