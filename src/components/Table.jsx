import { useEffect } from "react";
import { getArticleUrl, getUserUrl } from "../utils";

const Table = ({ table }) => {
  if (!table) return;

  let userCol = null;
  let titleCol = null;

  // Identify column id with users and titles
  table.head.map((head, index) => {
    if (head === "User") userCol = index;
    else if (head === "Title") titleCol = index;
  });

  // Change them to links
  table.body.forEach((body) => {
    if (typeof body[userCol] !== "string") return;

    if (userCol !== null) {
      body[userCol] = (
        <a href={getUserUrl(body[userCol])} target="_blank">
          {body[userCol]}
        </a>
      );
    }

    if (titleCol !== null) {
      body[titleCol] = (
        <a href={getArticleUrl(body[titleCol])} target="_blank">
          {body[titleCol]}
        </a>
      );
    }

    return body;
  });

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            {table.head.map((head, index) => (
              <th key={`th-${index}`}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.body.map((body, index) => (
            <tr key={`tr-${index}`}>
              {body.map((item, index) => (
                <td key={`td-${index}`}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
