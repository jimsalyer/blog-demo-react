import * as serviceUtils from '../serviceUtils';

describe('serviceUtils', () => {
  describe('parsePageCount()', () => {
    function createHeaderLink(name, page, url = 'http://www.example.com') {
      return `<${url}?_page=${page}>; rel="${name}"`;
    }

    it('returns the value of the "_page" query string parameter in a specific URL of the link header of an HTTP response', () => {
      const expectedValue = 4;

      const actualValue = serviceUtils.parsePageCount({
        headers: {
          link: createHeaderLink('last', expectedValue),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the response is not provided, undefined or null', () => {
      const expectedValue = 1;

      let actualValue = serviceUtils.parsePageCount();
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount(undefined);
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount(null);
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the response has no link header or the link header is invalid', () => {
      const expectedValue = 1;

      let actualValue = serviceUtils.parsePageCount({});
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount({ notHeaders: {} });
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount({ headers: {} });
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount({
        headers: { notLink: 'notLinkValue' },
      });
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount({ headers: { link: true } });
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the link header does not contain a URL with a "rel" value of "last"', () => {
      const expectedValue = 1;

      const actualValue = serviceUtils.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('prev', 1),
            createHeaderLink('next', 3),
          ].join(','),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the link header contains an invalid URL with a "rel" value of "last"', () => {
      const expectedValue = 1;

      let actualValue = serviceUtils.parsePageCount({
        headers: {
          link: [createHeaderLink('first', 1), '<>; rel="last"'].join(','),
        },
      });
      expect(actualValue).toBe(expectedValue);

      actualValue = serviceUtils.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('last', 10, 'bad_url'),
          ].join(','),
        },
      });
      expect(actualValue).toBe(expectedValue);
    });

    it('returns 1 if the URL with a "rel" value of "last" does not have the correct query string value', () => {
      const expectedValue = 1;

      const actualValue = serviceUtils.parsePageCount({
        headers: {
          link: [
            createHeaderLink('first', 1),
            createHeaderLink('last', 10).replace('_page', 'pageIndex'),
          ].join(','),
        },
      });

      expect(actualValue).toBe(expectedValue);
    });
  });

  describe('parseQueryString()', () => {
    it('converts a query string into an object', () => {
      const expectedValue = {
        firstName: 'John',
        lastName: 'Smith',
      };

      const actualValue = serviceUtils.parseQueryString(
        '?firstName=John&lastName=Smith'
      );

      expect(actualValue).toEqual(expectedValue);
    });

    it('parses booleans and numbers from applicable string values', () => {
      const expectedValue = {
        trueValue: true,
        falseValue: false,
        positiveValue: 9,
        negativeValue: -18,
      };

      const actualValue = serviceUtils.parseQueryString(
        '?trueValue=true&falseValue=false&positiveValue=9&negativeValue=-18'
      );

      expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('stringifyQueryParams()', () => {
    it('converts an object into a query string', () => {
      const expectedValue = 'firstName=John&lastName=Smith';

      const actualValue = serviceUtils.stringifyQueryParams({
        firstName: 'John',
        lastName: 'Smith',
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('skips empty strings and null values', () => {
      const expectedValue = 'age=23&firstName=John&lastName=Smith';

      const actualValue = serviceUtils.stringifyQueryParams({
        firstName: 'John',
        lastName: 'Smith',
        age: 23,
        birthDate: null,
        postalCode: '',
      });

      expect(actualValue).toBe(expectedValue);
    });
  });
});
