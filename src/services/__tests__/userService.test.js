import { mockClient } from 'axios';
import * as userService from '../userService';

describe('userService', () => {
  describe('createUser()', () => {
    it('makes a POST request with the given data and returns the result', async () => {
      const expectedUser = {
        name: 'Test User',
        username: 'Test',
        email: 'test.user@example.com',
        address: {
          street: '1234 Test St',
          city: 'Test',
          zipcode: '12345',
          geo: {
            lat: '37.2090',
            lng: '93.2923',
          },
        },
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
        name: 'Test User',
        username: 'Test',
        email: 'test.user@example.com',
        address: {
          street: '1234 Test St',
          city: 'Test',
          zipcode: '12345',
          geo: {
            lat: '37.2090',
            lng: '93.2923',
          },
        },
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
          name: 'Test User',
          username: 'Test',
          email: 'test.user@example.com',
          address: {
            street: '1234 Test St',
            city: 'Test',
            zipcode: '12345',
            geo: {
              lat: '37.2090',
              lng: '93.2923',
            },
          },
        },
        {
          id: 2,
          name: 'Sample User',
          username: 'Sample',
          email: 'sample.user@example.com',
          address: {
            street: '1234 Sample St',
            city: 'Sample',
            zipcode: '12345',
            geo: {
              lat: '37.0842',
              lng: '94.5133',
            },
          },
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
        name: 'Test User',
        username: 'Test',
        email: 'test.user@example.com',
        address: {
          street: '1234 Test St',
          city: 'Test',
          zipcode: '12345',
          geo: {
            lat: '37.2090',
            lng: '93.2923',
          },
        },
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
