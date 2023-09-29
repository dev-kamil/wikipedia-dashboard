import { getUserUrl } from "../utils";

const NewUsers = ({ newUsers }) => {
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
};

export default NewUsers;
