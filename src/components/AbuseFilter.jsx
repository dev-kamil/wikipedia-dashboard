import Table from "./Table";

const AbuseFilter = ({ abuseFilter }) => {
  if (!abuseFilter) return "Loading...";

  const tableBody = [];
  abuseFilter.forEach((abuse) =>
    tableBody.push([abuse.user, abuse.action, abuse.title, abuse.filter])
  );

  return (
    <Table
      table={{
        head: ["User", "Action", "Title", "Filter"],
        body: tableBody,
      }}
    />
  );
};

export default AbuseFilter;
