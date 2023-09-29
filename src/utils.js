const wikiBaseUrl = "https://pl.wikipedia.org/wiki/";

export function getArticleUrl(article) {
  return encodeURI(wikiBaseUrl + article);
}

export function getUserUrl(user) {
  return encodeURI(wikiBaseUrl + "Wikipedysta:" + user);
}