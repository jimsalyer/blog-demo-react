import queryString from 'query-string';

export function parsePageValue(links, name) {
  let page = 0;
  if (links && links.length && name) {
    const namedLink = links.find((link) => link.includes(`rel="${name}"`));
    if (namedLink) {
      try {
        const matches = /<([^>]+)>/.exec(namedLink);
        if (matches && matches.length > 1) {
          const url = new URL(matches[1]);
          const queryParams = queryString.parse(url.search, {
            parseBooleans: true,
            parseNumbers: true,
          });

          if (queryParams._page > 0) {
            page = queryParams._page;
          }
        }
      } catch {
        // Do nothing
      }
    }
  }
  return page;
}

export function parsePaginationValues(response) {
  const pagination = {
    first: 0,
    prev: 0,
    next: 0,
    last: 0,
  };

  if (response && response.headers && response.headers.link) {
    const links = response.headers.link.split(',');
    pagination.first = parsePageValue(links, 'first');
    pagination.prev = parsePageValue(links, 'prev');
    pagination.next = parsePageValue(links, 'next');
    pagination.last = parsePageValue(links, 'last');
  }
  return pagination;
}
