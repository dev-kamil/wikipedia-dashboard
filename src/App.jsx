import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Liczba artykułów, użytkowników, aktywnych użytkowników, administratorów, redaktorów
  const statistictsUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics|usergroups&sinumberingroup&origin=*&format=json";
  const abuseFilterUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=abuselog&aflprop=ids|filter|user|title|action|result&format=json&origin=*";
  const wikiBaseUrl = "https://pl.wikipedia.org/wiki/";
  const newArticlesUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=recentchanges&rctype=new&rcnamespace=0&rcprop=ids|timestamp|user|title&format=json&origin=*";
  const newUsersUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=logevents&letype=newusers&format=json&origin=*";

  const [statistics, setStatistics] = useState();
  const [abusefilter, setAbusefilter] = useState();
  const [newArticles, setNewArticles] = useState();
  const [newUsers, setNewUsers] = useState();

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
    fetch(newUsersUrl)
      .then((response) => response.json())
      .then((json) => setNewUsers(json.query.logevents))
      .catch((error) => console.error(error));
  }, []);

  function Statistics() {
    if (!statistics) return <span>Loading...</span>;
    const articles = statistics.statistics.articles.toLocaleString();
    const users = statistics.statistics.users.toLocaleString();
    const activeUsers = statistics.statistics.activeusers.toLocaleString();
    const admins = statistics.statistics.admins.toLocaleString();
    // Possibly error if no result
    const editors = statistics.usergroups.filter(
      (group) => group.name === "editor"
    )[0].number;

    return (
      // TRANSFORM IT TO OBJECT TO MAP IT
      <div className="grid gap-4 grid-cols-4">
        <div className="bg-white rounded-lg p-4 drop-shadow-2xl transition-shadow duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-700/30">
          <p className="text-slate-500">Articles</p>
          <p className="font-bold text-2xl">{articles}</p>
        </div>
        <div className="bg-white rounded-lg p-4 drop-shadow-2xl">
          <p className="text-slate-500">Users</p>
          <p className="font-bold text-2xl">{users}</p>
        </div>
        <div className="bg-white rounded-lg p-4 drop-shadow-2xl">
          <p className="text-slate-500">Editors</p>
          <p className="font-bold text-2xl">{editors}</p>
        </div>
        <div className="bg-white rounded-lg p-4 drop-shadow-2xl">
          <p className="text-slate-500">Administrators</p>
          <p className="font-bold text-2xl">{admins}</p>
        </div>
      </div>
    );
  }

  function Abusefilter() {
    if (!abusefilter) return "Loading...";
    return (
      <div className="bg-white rounded-lg p-4 shadow-2xl overflow-y-auto">
        <table className="table-auto rounded-lg w-full">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-1">#</th>
              <th className="px-4 py-1">User</th>
              <th className="px-4 py-1">Action</th>
              <th className="px-4 py-1">Title</th>
              <th className="px-4 py-1">Filter</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {abusefilter.map((abuse) => (
              <tr className="border-b last:border-0 hover:bg-slate-100 " key={abuse.id}>
                <td className="px-4 py-1">{abuse.id}</td>
                <td className="px-4 py-1">{abuse.user}</td>
                <td className="px-4 py-1">{abuse.action}</td>
                <td className="px-4 py-1">
                  <a
                    href={wikiBaseUrl + encodeURI(abuse.title)}
                    className="text-violet-800 underline"
                    target="_blank"
                  >
                    {abuse.title.length > 30
                      ? abuse.title.substring(0, 30 - 3) + "..."
                      : abuse.title}
                  </a>
                </td>
                <td className="px-4 py-1">{abuse.filter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              <td>{new Date(article.timestamp).toLocaleString()}</td>
              <td>{article.user}</td>
              <td>
                <a
                  href={wikiBaseUrl + encodeURI(article.title)}
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

  function NewUsers() {
    if (!newUsers) return "Loading...";
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Time diff</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {newUsers.map((user) => (
            <tr key={`new-user-${user.params.userid}`}>
              <td>{user.logid}</td>
              <td>{new Date(user.timestamp).toLocaleString()}</td>
              <td>
                {Math.round(
                  (Date.now() - new Date(user.timestamp).getTime()) / 60000
                )}{" "}
                min ago
              </td>
              <td>
                <a href={encodeURI(wikiBaseUrl + user.title)} target="_blank">
                  {user.user}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="bg-slate-200 w-full">
      <header className="p-4 container m-auto">
        <h1 className="text-2xl font-bold tracking-tight text-violet-700">Wikipedia Dashboard</h1>
      </header>
      <div className="container m-auto px-4">
        <h2 className="text-2xl mb-2">Statistics</h2>
        <Statistics />
      </div>
      <div className="container m-auto px-4 mt-4">
        <h2 className="text-2xl mb-2">Abuse Filter</h2>
        <Abusefilter />
      </div>
      <h2>New Articles</h2>
      <NewArticles />
      <h2>New Users</h2>
      <NewUsers />
    </div>
  );
}

export default App;
