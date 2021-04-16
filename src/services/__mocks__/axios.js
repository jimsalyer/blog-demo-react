export const apiUrl = 'http://www.example.com';
process.env.API_URL = apiUrl;

export const mockClient = {
  delete: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
};

const mockAxios = {
  create: jest.fn(() => mockClient),
};

export default mockAxios;
