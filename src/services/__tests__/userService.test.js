import { mockClient } from 'axios';
import * as userService from '../userService';

describe('userService', () => {
  describe('createUser()', () => {
    it('makes a POST request with the given data and returns the result', async () => {
      const expectedUser = {
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test.user@example.com',
        username: 'tuser',
        createUtc: '2020-01-01T00:00:00Z',
        modifyUtc: '2020-01-02T00:00:00Z',
      };

      const postSpy = jest.spyOn(mockClient, 'post').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await userService.createUser(expectedUser);

      expect(postSpy).toHaveBeenCalledWith('/', expectedUser);
      expect(actualUser).toStrictEqual(expectedUser);

      postSpy.mockRestore();
    });
  });

  describe('deleteUser()', () => {
    it('makes a DELETE request with the given ID', async () => {
      const expectedId = 1;
      const deleteSpy = jest.spyOn(mockClient, 'delete');

      await userService.deleteUser(expectedId);

      expect(deleteSpy).toHaveBeenCalledWith(`/${expectedId}`);

      deleteSpy.mockRestore();
    });
  });

  describe('getUser()', () => {
    it('makes a GET request with the given ID and returns the result', async () => {
      const expectedId = 1;
      const expectedUser = {
        id: expectedId,
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test.user@example.com',
        username: 'tuser',
        createUtc: '2020-01-01T00:00:00Z',
        modifyUtc: '2020-01-02T00:00:00Z',
      };

      const getSpy = jest.spyOn(mockClient, 'get').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await userService.getUser(expectedId);

      expect(getSpy).toHaveBeenCalledWith(`/${expectedId}`);
      expect(actualUser).toStrictEqual(expectedUser);

      getSpy.mockRestore();
    });
  });

  describe('listUsers()', () => {
    it('makes a GET request with the given parameters and returns the resulting data and pagination values', async () => {
      const expectedData = [
        {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          emailAddress: 'test.user@example.com',
          username: 'tuser',
          createUtc: '2020-01-01T00:00:00Z',
          modifyUtc: '2020-01-02T00:00:00Z',
        },
        {
          id: 2,
          firstName: 'Sample',
          lastName: 'User',
          emailAddress: 'sample.user@example.com',
          username: 'suser',
          createUtc: '2020-01-01T00:00:00Z',
          modifyUtc: '2020-01-02T00:00:00Z',
        },
      ];

      const mockResponse = {
        data: expectedData,
      };

      const getSpy = jest
        .spyOn(mockClient, 'get')
        .mockResolvedValue(mockResponse);

      const actualData = await userService.listUsers();

      expect(getSpy).toHaveBeenCalledWith('/');
      expect(actualData).toStrictEqual(expectedData);
    });
  });

  describe('updateUser()', () => {
    it('makes a PUT request with the given ID and data and returns the result', async () => {
      const expectedId = 1;
      const expectedUser = {
        id: expectedId,
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test.user@example.com',
        username: 'tuser',
        createUtc: '2020-01-01T00:00:00Z',
        modifyUtc: '2020-01-02T00:00:00Z',
      };

      const putSpy = jest.spyOn(mockClient, 'put').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await userService.updateUser(expectedId, expectedUser);

      expect(putSpy).toHaveBeenCalledWith(`/${expectedId}`, expectedUser);
      expect(actualUser).toStrictEqual(expectedUser);

      putSpy.mockRestore();
    });
  });
});
