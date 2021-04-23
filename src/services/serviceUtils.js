import queryString from 'query-string';

export function parsePageCount(response) {
  if (
    response &&
    response.headers &&
    typeof response.headers.link === 'string'
  ) {
    const links = response.headers.link.split(',');
    const lastLink = links.find((link) => link.includes('rel="last"'));

    if (lastLink) {
      try {
        const matches = /<([^>]+)>/.exec(lastLink);
        if (matches && matches.length > 1) {
          const url = new URL(matches[1]);
          const queryParams = parseQueryString(url.search);

          if (queryParams._page > 0) {
            return queryParams._page;
          }
        }
      } catch {
        // Do nothing
      }
    }
  }
  return 1;
}

export function parseQueryString(value) {
  return queryString.parse(value, {
    parseBooleans: true,
    parseNumbers: true,
  });
}

export function stringifyQueryParams(value) {
  return queryString.stringify(value, {
    skipEmptyString: true,
    skipNull: true,
  });
}
