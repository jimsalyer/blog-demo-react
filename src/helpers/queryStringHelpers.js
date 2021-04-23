import queryString from 'query-string';

export function fromQueryString(value) {
  return queryString.parse(value, {
    parseBooleans: true,
    parseNumbers: true,
  });
}

export function toQueryString(value) {
  return queryString.stringify(value, {
    skipEmptyString: true,
    skipNull: true,
  });
}
