import BaseService from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  async createUser(user) {
    const response = await this.client.post('/', user);
    return response.data;
  }

  async deleteUser(id) {
    await this.client.delete(`/${id}`);
  }

  async getUser(id) {
    const response = await this.client.get(`/${id}`);
    return response.data;
  }

  async listUsers() {
    const response = await this.client.get('/');
    return response.data;
  }

  async updateUser(id, user) {
    const response = await this.client.put(`/${id}`, user);
    return response.data;
  }
}

export default new UserService();
