import createClient from './createClient';

export const client = createClient('/users');

export async function createUser(user) {
  const response = await client.post('/', user);
  return response.data;
}

export async function deleteUser(id) {
  await client.delete(`/${id}`);
}

export async function getUser(id) {
  const response = await client.get(`/${id}`);
  return response.data;
}

export async function listUsers() {
  const response = await client.get('/');
  return response.data;
}

export async function updateUser(id, user) {
  const response = await client.put(`/${id}`, user);
  return response.data;
}
