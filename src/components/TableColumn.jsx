import React, { useState } from "react";
import "../css/Table.css";
import { handleTableExpand } from "../modules/codemirror";
import upArrow from "../images/upArrow.svg";
import downArrow from "../images/downArrow.svg";
export const TableColumn = ({ item, filter, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const generateSpaces = (num) => {
    return Array(num).fill("\u00A0\u00A0\u00A0").join("");
  };
  return (
    <div className="table-row">
      <div>
        {item[0][0] !== "root" ? (
          <>
            <span>{generateSpaces(parseInt(item[0][0][0], 10))}</span>
            {item[0][0]}
          </>
        ) : (
          <span>{item[0][0]}</span>
        )}
      </div>
      <div>{item[0][1]}</div>
      {/* {item[0][0] !== "child" ? (
        <span
          className="expand-button"
          onClick={() => {
            handleTableExpand(event, id);
            setIsExpanded(!isExpanded);
          }}
        >
          <img className="arrow" src={isExpanded ? upArrow : downArrow}></img>
        </span>
      ) : null} */}
    </div>
  );
};
