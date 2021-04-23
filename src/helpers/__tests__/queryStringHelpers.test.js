import * as queryStringHelpers from '../queryStringHelpers';

describe('queryStringHelpers', () => {
  describe('fromQueryString()', () => {
    it('converts a query string into an object', () => {
      const expectedValue = {
        firstName: 'John',
        lastName: 'Smith',
      };

      const actualValue = queryStringHelpers.fromQueryString(
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

      const actualValue = queryStringHelpers.fromQueryString(
        '?trueValue=true&falseValue=false&positiveValue=9&negativeValue=-18'
      );

      expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('toQueryString()', () => {
    it('converts an object into a query string', () => {
      const expectedValue = 'firstName=John&lastName=Smith';

      const actualValue = queryStringHelpers.toQueryString({
        firstName: 'John',
        lastName: 'Smith',
      });

      expect(actualValue).toBe(expectedValue);
    });

    it('skips empty strings and null values', () => {
      const expectedValue = 'age=23&firstName=John&lastName=Smith';

      const actualValue = queryStringHelpers.toQueryString({
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
