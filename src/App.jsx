import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import "./App.css";

// TODO
// - Separate components
// - Refresh button to update data
// - Compare current statistics to previous day (wikistats)
// - Placeholder while requesting data
// Optionally
// - Automatically refresh data
// - Highlight new changes
// - Charts based on data from wikistats

function App() {
  const statistictsUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics|usergroups&sinumberingroup&origin=*&format=json";
  const abuseFilterUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=abuselog&aflprop=ids|filter|user|title|action|result&format=json&origin=*";
  const wikiBaseUrl = "https://pl.wikipedia.org/wiki/";
  const newArticlesUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=recentchanges&rctype=new&rcnamespace=0&rcprop=ids|timestamp|user|title&format=json&origin=*";
  const newUsersUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=logevents&letype=newusers&format=json&origin=*";

  const moonIcon = <MoonIcon className="h-6 w-6 text-slate-500" />;
  const sunIcon = <SunIcon className="h-6 w-6 dark:text-slate-500" />;

  const [statistics, setStatistics] = useState();
  const [abusefilter, setAbusefilter] = useState();
  const [newArticles, setNewArticles] = useState();
  const [newUsers, setNewUsers] = useState();
  const [themeIcon, setThemeIcon] = useState(
    localStorage.theme === "light" ? moonIcon : sunIcon
  );

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

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }

  function getArticleUrl(article) {
    return encodeURI(wikiBaseUrl + article);
  }

  function getUserUrl(user) {
    return encodeURI(wikiBaseUrl + "Wikipedysta:" + user);
  }

  function Statistics() {
    if (!statistics) return <span>Loading...</span>;
    const articles = statistics.statistics.articles.toLocaleString();
    const users = statistics.statistics.users.toLocaleString();
    const activeUsers = statistics.statistics.activeusers.toLocaleString();
    const admins = statistics.statistics.admins.toLocaleString();
    const editors = statistics.usergroups.filter(
      (group) => group.name === "editor"
    )[0].number;
    const stats = {
      Articles: articles,
      Users: users,
      Administrators: admins,
      Editors: editors,
    };

    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(stats).map(([k, v]) => (
          <div
            key={`stats-${k}`}
            className="bg-white rounded-lg p-4 drop-shadow-2xl hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <p className="text-slate-500 dark:text-slate-400">{k}</p>
            <p className="font-bold text-2xl dark:text-slate-50">{v}</p>
          </div>
        ))}
      </div>
    );
  }

  function Abusefilter() {
    if (!abusefilter) return "Loading...";
    return (
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Title</th>
              <th>Filter</th>
            </tr>
          </thead>
          <tbody>
            {abusefilter.map((abuse) => (
              <tr key={abuse.id}>
                <td>
                  <a href={getUserUrl(abuse.user)}>{abuse.user}</a>
                </td>
                <td>{abuse.action}</td>
                <td>
                  <a href={getArticleUrl(abuse.title)} target="_blank">
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
      </div>
    );
  }

  function NewArticles() {
    if (!newArticles) return "Loading...";
    return (
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {newArticles.map((article) => (
              <tr key={article.pageid}>
                <td>{new Date(article.timestamp).toLocaleString()}</td>
                <td>
                  <a href={getUserUrl(article.user)}>{article.user}</a>
                </td>
                <td>
                  <a href={getArticleUrl(article.title)} target="_blank">
                    {article.title.length > 40
                      ? article.title.substring(0, 40 - 3) + "..."
                      : article.title}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function NewUsers() {
    if (!newUsers) return "Loading...";
    return (
      <div className="table-card">
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
                <td>{user.params.userid}</td>
                <td>{new Date(user.timestamp).toLocaleString()}</td>
                <td>
                  {Math.round(
                    (Date.now() - new Date(user.timestamp).getTime()) / 60000
                  )}{" "}
                  min ago
                </td>
                <td>
                  <a href={getUserUrl(user.user)} target="_blank">
                    {user.user}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function DarkModeSwitch() {
    function handleClick() {
      if (!localStorage.theme) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          localStorage.theme = "dark";
        } else localStorage.theme = "light";
      } else if (localStorage.theme === "dark") {
        localStorage.theme = "light";
        setThemeIcon(moonIcon);
      } else {
        localStorage.theme = "dark";
        setThemeIcon(sunIcon);
      }
    }

    return (
      <button className="dark:text-slate-400" onClick={handleClick}>
        {themeIcon}
      </button>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 w-full min-h-screen transition ease-out duration-300">
      <header className="px-4 py-8 container m-auto sm:flex justify-between items-center">
        <h1
          className="text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r bg-clip-text from-purple-800 via-purple-600 to-purple-800
        dark:from-purple-300 dark:via-purple-200 dark:to-purple-300"
        >
          Wikipedia Dashboard
        </h1>
        <DarkModeSwitch />
      </header>
      <div className="container m-auto px-4">
        <h2>Statistics</h2>
        <Statistics />
      </div>
      <div className="container m-auto px-4 mt-4">
        <h2>Abuse Filter</h2>
        <Abusefilter />
      </div>
      <div className="container m-auto px-4 mt-4">
        <h2>New Articles</h2>
        <NewArticles />
      </div>
      <div className="container m-auto px-4 mt-4 pb-12">
        <h2>New Users</h2>
        <NewUsers />
      </div>
    </div>
  );
}

export default App;
