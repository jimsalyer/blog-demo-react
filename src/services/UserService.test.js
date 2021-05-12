import axios from 'axios';
import UserService from './UserService';

describe('UserService', () => {
  let client;
  let createSpy;
  let service;

  beforeEach(() => {
    client = axios.create();
    createSpy = jest.spyOn(axios, 'create').mockImplementation((config) => {
      client.defaults = {
        ...client.defaults,
        config,
      };
      return client;
    });
    service = new UserService();
  });

  afterEach(() => {
    createSpy.mockRestore();
  });

  describe('createUser()', () => {
    it('makes a POST request with the given data and returns the result', async () => {
      const expectedUser = {
        username: 'tuser',
        password: 'p@ssw0rd',
      };

      const postSpy = jest.spyOn(client, 'post').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await service.createUser(expectedUser);

      expect(postSpy).toHaveBeenCalledWith('/', expectedUser);
      expect(actualUser).toStrictEqual(expectedUser);

      postSpy.mockRestore();
    });
  });

  describe('deleteUser()', () => {
    it('makes a DELETE request with the given ID', async () => {
      const expectedId = 1;
      const deleteSpy = jest.spyOn(client, 'delete').mockResolvedValue(null);

      await service.deleteUser(expectedId);

      expect(deleteSpy).toHaveBeenCalledWith(`/${expectedId}`);

      deleteSpy.mockRestore();
    });
  });

  describe('getUser()', () => {
    it('makes a GET request with the given ID and returns the result', async () => {
      const expectedUser = {
        id: 1,
        username: 'tuser',
        password: 'p@ssw0rd',
      };

      const getSpy = jest.spyOn(client, 'get').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await service.getUser(expectedUser.id);

      expect(getSpy).toHaveBeenCalledWith(`/${expectedUser.id}`);
      expect(actualUser).toStrictEqual(expectedUser);

      getSpy.mockRestore();
    });
  });

  describe('listUsers()', () => {
    it('makes a GET request with the given parameters and returns the resulting data and pagination values', async () => {
      const expectedData = [
        {
          id: 1,
          username: 'tuser',
          password: 'p@ssw0rd',
        },
        {
          id: 2,
          username: 'suser',
          password: 'p@ssw0rd',
        },
      ];

      const mockResponse = {
        data: expectedData,
      };

      const getSpy = jest.spyOn(client, 'get').mockResolvedValue(mockResponse);

      const actualData = await service.listUsers();

      expect(getSpy).toHaveBeenCalledWith('/');
      expect(actualData).toStrictEqual(expectedData);
    });
  });

  describe('updateUser()', () => {
    it('makes a PUT request with the given ID and data and returns the result', async () => {
      const expectedUser = {
        id: 1,
        username: 'tuser',
        password: 'p@ssw0rd',
      };

      const putSpy = jest.spyOn(client, 'put').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await service.updateUser(
        expectedUser.id,
        expectedUser
      );

      expect(putSpy).toHaveBeenCalledWith(`/${expectedUser.id}`, expectedUser);
      expect(actualUser).toStrictEqual(expectedUser);

      putSpy.mockRestore();
    });
  });
});
