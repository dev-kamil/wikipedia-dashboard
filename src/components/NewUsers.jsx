import Table from "./Table";

const NewUsers = ({ newUsers }) => {
  if (!newUsers) return "Loading...";

  const tableBody = [];
  newUsers.forEach((user) => {
    tableBody.push([
      user.params.userid,
      new Date(user.timestamp).toLocaleString(),
      Math.round((Date.now() - new Date(user.timestamp).getTime()) / 60000) + " min ago",
      user.user
    ]);
  });

  return (
    <Table
      table={{
        head: ["#", "Date", "Time diff", "User"],
        body: tableBody,
      }}
    />
  );
};

export default NewUsers;
