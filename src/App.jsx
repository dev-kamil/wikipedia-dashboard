import { useEffect, useState } from "react";
import "./App.css";
import Statistics from "./components/Statistics";
import AbuseFilter from "./components/AbuseFilter";
import NewArticles from "./components/NewArticles";
import NewUsers from "./components/NewUsers";
import DarkModeSwitch from "./components/DarkModeSwitch";

// TODO:
// [+] Separate components
// [] Refresh button to update data
// [] Compare current statistics to previous day (wikistats)
// [] Placeholder while requesting data
// Optionally:
// [] Automatically refresh data
// [] Highlight new changes
// [] Charts based on data from wikistats

function App() {
  const statistictsUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=statistics|usergroups&sinumberingroup&origin=*&format=json";
  const abuseFilterUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=abuselog&aflprop=ids|filter|user|title|action|result&format=json&origin=*";
  const newArticlesUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=recentchanges&rctype=new&rcnamespace=0&rcprop=ids|timestamp|user|title&format=json&origin=*";
  const newUsersUrl =
    "https://pl.wikipedia.org/w/api.php?action=query&list=logevents&letype=newusers&format=json&origin=*";

  const [statistics, setStatistics] = useState();
  const [abuseFilter, setabuseFilter] = useState();
  const [newArticles, setNewArticles] = useState();
  const [newUsers, setNewUsers] = useState();

  useEffect(() => {
    fetch(statistictsUrl)
      .then((response) => response.json())
      .then((json) => setStatistics(json.query))
      .catch((error) => console.error(error));
    fetch(abuseFilterUrl)
      .then((response) => response.json())
      .then((json) => setabuseFilter(json.query.abuselog))
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
        <Statistics statistics={statistics} />
      </div>
      <div className="container m-auto px-4 mt-4">
        <h2>Abuse Filter</h2>
        <AbuseFilter abuseFilter={abuseFilter} />
      </div>
      <div className="container m-auto px-4 mt-4">
        <h2>New Articles</h2>
        <NewArticles newArticles={newArticles} />
      </div>
      <div className="container m-auto px-4 mt-4 pb-12">
        <h2>New Users</h2>
        <NewUsers newUsers={newUsers} />
      </div>
    </div>
  );
}

export default App;
