import * as authService from '../authService';

describe('authService', () => {
  let postSpy;

  beforeEach(() => {
    postSpy = jest.spyOn(authService.client, 'post');
  });

  afterEach(() => {
    postSpy.mockRestore();
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

      const actualUser = await authService.login(
        expectedUser.username,
        expectedUser.password,
        expectedBody.remember
      );

      expect(postSpy).toHaveBeenCalledWith('/login', expectedBody);
      expect(actualUser).toStrictEqual(expectedUser);
    });
  });

  describe('logout()', () => {
    it('makes a POST request to the logout endpoint with the given access token', async () => {
      const expectedBody = {
        accessToken: 'testaccesstoken',
      };

      postSpy.mockResolvedValue({});

      await authService.logout(expectedBody.accessToken);

      expect(postSpy).toHaveBeenCalledWith('/logout', expectedBody);
    });
  });
});
