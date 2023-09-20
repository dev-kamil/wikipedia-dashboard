import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Liczba artykułów, użytkowników, aktywnych użytkowników, administratorów, redaktorów
  const statistictsUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics|usergroups&sinumberingroup&origin=*&format=json";
  const abuseFilterUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=abuselog&aflprop=ids|filter|user|title|action|result&format=json&origin=*";
  const articleBaseUrl = "https://pl.wikipedia.org/wiki/";
  const newArticlesUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=recentchanges&rctype=new&rcnamespace=0&rcprop=ids|timestamp|user|title&format=json&origin=*";
    const newUsersUrl = 'https://pl.wikipedia.org/w/api.php?action=query&list=logevents&letype=newusers&format=json&origin=*'

  const [statistics, setStatistics] = useState();
  const [abusefilter, setAbusefilter] = useState();
  const [newArticles, setNewArticles] = useState();

  useEffect(() => {
    fetch(statistictsUrl)
      .then((response) => response.json())
      .then((json) => setStatistics(json.query))
      .catch((error) => console.error(error));
    fetch(abuseFilterUrl)
      .then((response) => response.json())
      .then((json) => setAbusefilter(json.query.abuselog))
      .catch((error) => console.error(error));
    fetch(newArticlesUrl)
      .then((response) => response.json())
      .then((json) => setNewArticles(json.query.recentchanges))
      .catch((error) => console.error(error));
  }, []);

  function Statistics() {
    if (!statistics) return <span>Loading...</span>;
    const articles = statistics.statistics.articles;
    const users = statistics.statistics.users;
    const activeUsers = statistics.statistics.activeusers;
    const admins = statistics.statistics.admins;
    // Possibly error if no result
    const editors = statistics.usergroups.filter(
      (group) => group.name === "editor"
    )[0].number;

    return (
      <ul>
        <li>Artykułów: {articles}</li>
        <li>Użytkowników: {users}</li>
        <li>Aktywnych użytkowników {activeUsers}</li>
        <li>Redaktorów {editors}</li>
        <li>Administratorów: {admins}</li>
      </ul>
    );
  }

  function Abusefilter() {
    if (!abusefilter) return "Loading...";
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
            <th>Title</th>
            <th>Filter</th>
          </tr>
        </thead>
        <tbody>
          {abusefilter.map((abuse) => (
            <tr key={abuse.id}>
              <td>{abuse.id}</td>
              <td>{abuse.user}</td>
              <td>{abuse.action}</td>
              <td>
                <a
                  href={articleBaseUrl + encodeURI(abuse.title)}
                  target="_blank"
                >
                  {abuse.title.length > 30
                    ? abuse.title.substring(0, 30 - 3) + "..."
                    : abuse.title}
                </a>
              </td>
              <td>{abuse.filter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function NewArticles() {
    if (!newArticles) return "Loading...";
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>User</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {newArticles.map((article) => (
            <tr key={article.pageid}>
              <td>{article.pageid}</td>
              <td>{article.timestamp}</td>
              <td>{article.user}</td>
              <td>
                <a
                  href={articleBaseUrl + encodeURI(article.title)}
                  target="_blank"
                >
                  {article.title}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Statistics</h2>
      <Statistics />
      <h2>Abuse Filter</h2>
      <Abusefilter />
      <h2>New Articles</h2>
      <NewArticles />
    </>
  );
}

export default App;
