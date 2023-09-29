import { getArticleUrl, getUserUrl } from "../utils";

const AbuseFilter = ({ abuseFilter }) => {
  if (!abuseFilter) return "Loading...";
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
          {abuseFilter.map((abuse) => (
            <tr key={abuse.id}>
              <td>
                <a href={getUserUrl(abuse.user)} target="_blank">
                  {abuse.user}
                </a>
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
};

export default AbuseFilter;
