import Table from "./Table";

const NewArticles = ({ newArticles }) => {
  if (!newArticles) return "Loading...";

  const tableBody = [];
  newArticles.forEach((article) => {
    tableBody.push([
      new Date(article.timestamp).toLocaleString(),
      article.user,
      article.title,
    ]);
  });

  return (
    <Table
      table={{
        head: ["Date", "User", "Title"],
        body: tableBody,
      }}
    />
  );
};

export default NewArticles;
