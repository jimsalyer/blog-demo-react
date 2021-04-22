export function parsePaginationValue(links, name) {
  let page = 0;
  if (links && links.length && name) {
    const link = links.find((l) => l.includes(`rel="${name}"`));
    if (link) {
      try {
        const url = new URL(link.replace(/<([^>]+)>/, '$1'));
        page = Number(url.searchParams.get('_page'));
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
    pagination.first = parsePaginationValue(links, 'first');
    pagination.prev = parsePaginationValue(links, 'prev');
    pagination.next = parsePaginationValue(links, 'next');
    pagination.last = parsePaginationValue(links, 'last');
  }
  return pagination;
}
