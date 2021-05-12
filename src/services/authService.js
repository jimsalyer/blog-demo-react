import BaseService from './BaseService';

export default class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async login(username, password, remember) {
    const response = await this.client.post('/login', {
      username,
      password,
      remember,
    });
    return response.data;
  }

  async logout() {
    await this.client.post('/logout');
  }
}
