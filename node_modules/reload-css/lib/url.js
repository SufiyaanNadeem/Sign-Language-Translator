var URL = require('url');

module.exports.resolve = URL.resolve.bind(URL);
module.exports.format = URL.format.bind(URL);

module.exports.parse = function (url) {
  // Handle protocol-relative URLs, a browser feature
  if (url.indexOf('//') === 0) {
    url = document.location.protocol + url;
  }
  return URL.parse(url);
};

module.exports.key = function (url, baseUrl) {
  // Strip hash/query and get a resolved URL pathname
  var parsed = URL.parse(url);
  url = URL.format({
    pathname: (parsed.pathname || '').replace(/\/+$/, '/')
  });
  return URL.resolve(baseUrl || document.location.pathname, url);
};
