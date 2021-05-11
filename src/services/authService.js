import createClient from './createClient';

export const client = createClient('/auth');

export async function login(username, password, remember) {
  const response = await client.post('/login', {
    username,
    password,
    remember,
  });
  return response.data;
}

export async function logout(accessToken) {
  await client.post('/logout', { accessToken });
}
