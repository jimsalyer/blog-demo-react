import axios from 'axios';
import queryString from 'query-string';
import PostService from './PostService';
import { stringifyQueryParams } from './serviceUtils';

describe('PostService', () => {
  let client;
  let createSpy;
  let service;

  beforeEach(() => {
    client = axios.create();
    createSpy = jest.spyOn(axios, 'create').mockImplementation((config) => {
      client.defaults = {
        ...client.defaults,
        config,
      };
      return client;
    });
    service = new PostService();
  });

  afterEach(() => {
    createSpy.mockRestore();
  });

  describe('createPost()', () => {
    it('makes a POST request with the given data and returns the result', async () => {
      const expectedPost = {
        title: 'test title',
        body: 'test body',
      };

      const postSpy = jest.spyOn(client, 'post').mockResolvedValue({
        data: expectedPost,
      });

      const actualPost = await service.createPost(expectedPost);

      expect(postSpy).toHaveBeenCalledWith('/', expectedPost);
      expect(actualPost).toStrictEqual(expectedPost);

      postSpy.mockRestore();
    });
  });

  describe('deletePost()', () => {
    it('makes a DELETE request with the given ID', async () => {
      const expectedId = 1;
      const deleteSpy = jest.spyOn(client, 'delete').mockResolvedValue(null);

      await service.deletePost(expectedId);

      expect(deleteSpy).toHaveBeenCalledWith(`/${expectedId}`);

      deleteSpy.mockRestore();
    });
  });

  describe('getPost()', () => {
    it('makes a GET request with the given ID and returns the result', async () => {
      const expectedPost = {
        id: 1,
        title: 'test title',
        body: 'test body',
      };

      const getSpy = jest.spyOn(client, 'get').mockResolvedValue({
        data: expectedPost,
      });

      const actualPost = await service.getPost(expectedPost.id);

      expect(getSpy).toHaveBeenCalledWith(`/${expectedPost.id}`);
      expect(actualPost).toStrictEqual(expectedPost);

      getSpy.mockRestore();
    });
  });

  describe('searchPosts()', () => {
    let getSpy;

    beforeEach(() => {
      getSpy = jest.spyOn(client, 'get');
    });

    afterEach(() => {
      getSpy.mockRestore();
    });

    it('makes a GET request with the given parameters and returns the resulting data and pagination values', async () => {
      const expectedParams = {
        author: 1,
        text: 'test',
        limit: 5,
        page: 2,
      };

      const expectedQueryParams = {
        userId: expectedParams.author,
        q: expectedParams.text,
        _limit: expectedParams.limit,
        _page: expectedParams.page,
      };

      const expectedData = [
        {
          id: 1,
          title: 'test title',
          body: 'test body',
          userId: 1,
        },
        {
          id: 2,
          title: 'test title 2',
          body: 'test body 2',
          userId: 1,
        },
      ];

      const mockResponse = {
        data: expectedData,
      };

      getSpy.mockResolvedValue(mockResponse);

      const actualResult = await service.searchPosts(expectedParams);

      expect(getSpy).toHaveBeenCalledWith(
        `/?${queryString.stringify(expectedQueryParams)}`
      );
      expect(actualResult.data).toStrictEqual(expectedData);
    });

    it('sets the parameters to default values if they are not provided', async () => {
      const queryParams = {
        _limit: service.defaultSearchParams.limit,
        _page: service.defaultSearchParams.page,
      };
      const query = stringifyQueryParams(queryParams);
      const expectedUrl = `/?${query}`;

      getSpy.mockResolvedValue({ data: [] });

      await service.searchPosts();

      expect(getSpy).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('updatePost()', () => {
    it('makes a PUT request with the given ID and data and returns the result', async () => {
      const expectedPost = {
        id: 1,
        title: 'test title',
        body: 'test body',
      };

      const putSpy = jest.spyOn(client, 'put').mockResolvedValue({
        data: expectedPost,
      });

      const actualPost = await service.updatePost(
        expectedPost.id,
        expectedPost
      );

      expect(putSpy).toHaveBeenCalledWith(`/${expectedPost.id}`, expectedPost);
      expect(actualPost).toStrictEqual(expectedPost);

      putSpy.mockRestore();
    });
  });
});
