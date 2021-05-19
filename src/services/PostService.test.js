import queryString from 'query-string';
import postService from './PostService';
import { stringifyQueryParams } from './serviceUtils';

describe('PostService', () => {
  describe('createPost()', () => {
    it('makes a POST request with the given data and returns the result', async () => {
      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test.png',
      };

      const postSpy = jest.spyOn(postService.client, 'post').mockResolvedValue({
        data: expectedPost,
      });

      const actualPost = await postService.createPost(expectedPost);

      expect(postSpy).toHaveBeenCalledWith('/', expectedPost);
      expect(actualPost).toStrictEqual(expectedPost);
    });
  });

  describe('deletePost()', () => {
    it('makes a DELETE request with the given ID', async () => {
      const expectedId = 1;

      const deleteSpy = jest
        .spyOn(postService.client, 'delete')
        .mockResolvedValue({});

      await postService.deletePost(expectedId);

      expect(deleteSpy).toHaveBeenCalledWith(`/${expectedId}`);
    });
  });

  describe('getPost()', () => {
    it('makes a GET request with the given ID and returns the result', async () => {
      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test.png',
      };

      const expectedQueryParams = {
        _expand: 'user',
      };

      const getSpy = jest.spyOn(postService.client, 'get').mockResolvedValue({
        data: expectedPost,
      });

      const actualPost = await postService.getPost(expectedPost.id);

      expect(getSpy).toHaveBeenCalledWith(
        `/${expectedPost.id}?${stringifyQueryParams(expectedQueryParams)}`
      );
      expect(actualPost).toStrictEqual(expectedPost);
    });
  });

  describe('searchPosts()', () => {
    let getSpy;

    beforeEach(() => {
      getSpy = jest.spyOn(postService.client, 'get');
    });

    it('makes a GET request with the given parameters and returns the resulting data and pagination values', async () => {
      const expectedParams = {
        author: 1,
        text: 'test',
        limit: 5,
        page: 2,
      };

      const expectedQueryParams = {
        _expand: 'user',
        _limit: expectedParams.limit,
        _order: postService.sortParams.order,
        _page: expectedParams.page,
        _sort: postService.sortParams.sort,
        q: expectedParams.text,
        userId: expectedParams.author,
      };

      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test.png',
        userId: 1,
      };

      const expectedPosts = [
        {
          ...expectedPost,
          id: 1,
        },
        {
          ...expectedPost,
          id: 2,
        },
      ];

      getSpy.mockResolvedValue({
        pageCount: 4,
        data: expectedPosts,
      });

      const actualResult = await postService.searchPosts(expectedParams);

      expect(getSpy).toHaveBeenCalledWith(
        `/?${queryString.stringify(expectedQueryParams)}`
      );
      expect(actualResult.data).toStrictEqual(expectedPosts);
    });

    it('sets the parameters to default values if they are not provided', async () => {
      const queryParams = {
        _expand: 'user',
        _limit: postService.defaultSearchParams.limit,
        _order: postService.sortParams.order,
        _page: postService.defaultSearchParams.page,
        _sort: postService.sortParams.sort,
      };
      const query = stringifyQueryParams(queryParams);
      const expectedUrl = `/?${query}`;

      getSpy.mockResolvedValue({ data: [] });

      await postService.searchPosts();

      expect(getSpy).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('updatePost()', () => {
    it('makes a PATCH request with the given ID and data and returns the result', async () => {
      const expectedId = 1;
      const expectedPost = {
        title: 'Test Title',
        body: 'Test Body',
        excerpt: 'Test Excerpt',
        image: 'http://www.example.com/test.png',
      };

      const patchSpy = jest
        .spyOn(postService.client, 'patch')
        .mockResolvedValue({ data: expectedPost });

      const actualPost = await postService.updatePost(expectedId, expectedPost);

      expect(patchSpy).toHaveBeenCalledWith(`/${expectedId}`, expectedPost);
      expect(actualPost).toStrictEqual(expectedPost);
    });
  });
});
