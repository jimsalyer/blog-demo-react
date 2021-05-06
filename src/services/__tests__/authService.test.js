import * as authService from '../authService';

describe('authService', () => {
  describe('login()', () => {
    it('makes a POST request with the given username and password and returns the result', async () => {
      const expectedUser = {
        id: 1,
        username: 'tuser',
        password: 'p@ssw0rd',
      };

      const expectedBody = {
        username: expectedUser.username,
        password: expectedUser.password,
      };

      const postSpy = jest.spyOn(authService.client, 'post').mockResolvedValue({
        data: expectedUser,
      });

      const actualUser = await authService.login(
        expectedUser.username,
        expectedUser.password
      );

      expect(postSpy).toHaveBeenCalledWith('/login', expectedBody);
      expect(actualUser).toStrictEqual(expectedUser);

      postSpy.mockRestore();
    });
  });
});
