import createClient from './createClient';
import { parsePaginationValues } from './serviceUtils';

const client = createClient('/posts');

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

export async function searchPosts(
  { limit, page, order, sort } = {
    limit: 10,
    page: 1,
    order: 'asc',
    sort: 'id',
  }
) {
  const response = await client.get(
    `/?_limit=${limit}&_page=${page}&_sort=${sort}&_order=${order}`
  );

  const result = {
    pagination: parsePaginationValues(response),
    data: response.data,
  };
  return result;
}

export async function updatePost(id, post) {
  const response = await client.put(`/${id}`, post);
  return response.data;
}
