import createClient from './createClient';
import { parsePageCount, stringifyQueryParams } from './serviceUtils';

const client = createClient('/posts');

export const defaultSearchParams = {
  limit: 10,
  page: 1,
};

export async function createPost(post) {
  const response = await client.post('/', post);
  return response.data;
}

export async function deletePost(id) {
  await client.delete(`/${id}`);
}

export async function getPost(id) {
  const response = await client.get(`/${id}`);
  return response.data;
}

export async function searchPosts(params) {
  const searchParams = {
    ...defaultSearchParams,
    ...params,
  };

  const queryParams = {
    _limit: searchParams.limit,
    _page: searchParams.page,
    q: searchParams.text,
    userId: searchParams.author,
  };

  const response = await client.get(`/?${stringifyQueryParams(queryParams)}`);
  const result = {
    pageCount: parsePageCount(response),
    data: response.data,
  };
  return result;
}

export async function updatePost(id, post) {
  const response = await client.put(`/${id}`, post);
  return response.data;
}
