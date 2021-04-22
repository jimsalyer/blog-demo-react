import { apiUrl } from 'axios';
import * as serviceUtils from '../serviceUtils';

function generateLink(currentUrl, page, rel) {
  const newUrl = new URL(currentUrl);
  const { searchParams } = newUrl;
  searchParams.set('_page', page);
  return `<${newUrl.toString()}>; rel="${rel}"`;
}

function generateHeader(currentUrl, pagination) {
  const links = Object.keys(pagination).map((key) => {
    const link = generateLink(currentUrl, pagination[key], key);
    return link;
  });
  return links.join(',');
}

describe('serviceUtils', () => {
  describe('parsePageValue()', () => {
    it('returns the value of the "_page" query string parameter in a header link', () => {
      const expectedValue = 4;

      const link = generateLink(apiUrl, expectedValue, 'next');

      const actualValue = serviceUtils.parsePageValue([link], 'next');

      expect(actualValue).toStrictEqual(expectedValue);
    });

    it('returns zero if the links array is null', () => {
      const expectedValue = 0;

      const actualValue = serviceUtils.parsePageValue();

      expect(actualValue).toStrictEqual(expectedValue);
    });

    it('returns zero if the links array is empty', () => {
      const expectedValue = 0;

      const actualValue = serviceUtils.parsePageValue([]);

      expect(actualValue).toStrictEqual(expectedValue);
    });

    it('returns zero if no name is provided', () => {
      const expectedValue = 0;

      const link = generateLink(apiUrl, expectedValue, 'next');

      const actualValue = serviceUtils.parsePageValue([link]);

      expect(actualValue).toStrictEqual(expectedValue);
    });

    it('returns zero if the named link is not found', () => {
      const expectedValue = 0;

      const link = generateLink(apiUrl, expectedValue, 'next');

      const actualValue = serviceUtils.parsePageValue([link], 'prev');

      expect(actualValue).toStrictEqual(expectedValue);
    });

    it('returns zero if the page value cannot be parsed from the matching link', () => {
      const expectedValue = 0;
      ['', '<>', '<invalid_url>'].forEach((value) => {
        const link = `${value}; rel="next"`;

        const actualValue = serviceUtils.parsePageValue([link], 'next');

        expect(actualValue).toStrictEqual(expectedValue);
      });
    });
  });

  describe('parsePaginationValues()', () => {
    it('parses pagination values from the Link header of an HTTP response', () => {
      const expectedPagination = {
        first: 1,
        prev: 2,
        next: 4,
        last: 10,
      };

      const response = {
        headers: {
          link: generateHeader(apiUrl, expectedPagination),
        },
      };

      const actualPagination = serviceUtils.parsePaginationValues(response);

      expect(actualPagination).toStrictEqual(expectedPagination);
    });

    it('returns a default set of values if no response is provided', () => {
      const expectedPagination = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
      };

      const actualPagination = serviceUtils.parsePaginationValues();

      expect(actualPagination).toStrictEqual(expectedPagination);
    });

    it('returns a default set of values if no headers are present in the response', () => {
      const expectedPagination = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
      };

      const response = {};

      const actualPagination = serviceUtils.parsePaginationValues(response);

      expect(actualPagination).toStrictEqual(expectedPagination);
    });

    it('returns a default set of values if no Link header is present in the response', () => {
      const expectedPagination = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
      };

      const response = {
        headers: {
          'content-type': 'application/json',
        },
      };

      const actualPagination = serviceUtils.parsePaginationValues(response);

      expect(actualPagination).toStrictEqual(expectedPagination);
    });

    it('returns a default set of values if the Link header is invalid', () => {
      const expectedPagination = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
      };

      const response = {
        headers: {
          link: 'invalid-link-header',
        },
      };

      const actualPagination = serviceUtils.parsePaginationValues(response);

      expect(actualPagination).toStrictEqual(expectedPagination);
    });
  });
});
