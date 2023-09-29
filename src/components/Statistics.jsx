const Statistics = ({statistics}) => {
  if (!statistics) return <span>Loading...</span>;

  const articles = statistics.statistics.articles.toLocaleString();
  const users = statistics.statistics.users.toLocaleString();
  // const activeUsers = statistics.statistics.activeusers.toLocaleString();
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
};

export default Statistics;
