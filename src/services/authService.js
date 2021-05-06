import createClient from './createClient';

export const client = createClient('/auth');

export async function login(username, password) {
  const response = await client.post('/login', { username, password });
  return response.data;
}
