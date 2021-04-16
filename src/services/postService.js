import createClient from './createClient';

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

export async function searchPosts() {
  const response = await client.get('/');
  return response.data;
}

export async function updatePost(id, post) {
  const response = await client.put(`/${id}`, post);
  return response.data;
}
