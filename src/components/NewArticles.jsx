import { getArticleUrl, getUserUrl } from "../utils";

const NewArticles = ({ newArticles }) => {
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
                <a href={getUserUrl(article.user)} target="_blank">
                  {article.user}
                </a>
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
};

export default NewArticles;
