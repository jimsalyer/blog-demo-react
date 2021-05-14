import BaseService from './BaseService';
import { parsePageCount, stringifyQueryParams } from './serviceUtils';

export class PostService extends BaseService {
  constructor() {
    super('/posts');

    this.defaultSearchParams = {
      limit: 10,
      page: 1,
    };

    this.sortParams = {
      order: 'desc,desc,desc',
      sort: 'modifyUtc,publishUtc,createUtc',
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
      _expand: 'user',
      _limit: searchParams.limit,
      _order: this.sortParams.order,
      _page: searchParams.page,
      _sort: this.sortParams.sort,
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

export default new PostService();
