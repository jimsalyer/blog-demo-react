import BaseService from './BaseService';
import { parsePageCount, stringifyQueryParams } from './serviceUtils';

export default class PostService extends BaseService {
  constructor() {
    super('/posts');

    this.defaultSearchParams = {
      limit: 10,
      page: 1,
    };
  }

  async createPost(post) {
    const response = await this.client.post('/', post);
    return response.data;
  }

  async deletePost(id) {
    await this.client.delete(`/${id}`);
  }

  async getPost(id) {
    const response = await this.client.get(`/${id}`);
    return response.data;
  }

  async searchPosts(params) {
    const searchParams = { ...this.defaultSearchParams, ...params };

    const queryParams = {
      _limit: searchParams.limit,
      _page: searchParams.page,
      q: searchParams.text,
      userId: searchParams.author,
    };

    const response = await this.client.get(
      `/?${stringifyQueryParams(queryParams)}`
    );

    const result = {
      pageCount: parsePageCount(response),
      data: response.data,
    };
    return result;
  }

  async updatePost(id, post) {
    const response = await this.client.put(`/${id}`, post);
    return response.data;
  }
}
