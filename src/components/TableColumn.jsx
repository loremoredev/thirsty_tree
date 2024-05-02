import React, { useState } from "react";
import "../css/Table.css";
import { handleTableExpand } from "../modules/codemirror";
import upArrow from "../images/upArrow.svg";
import downArrow from "../images/downArrow.svg";
export const TableColumn = ({ item, filter, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`${item[0][0] !== filter ? "hidden" : null} table-row`}>
      <div>{item[0][0]}</div>
      <div>{item[0][1]}</div>
      {item[0][0] !== "child" ? (
        <span
          className="expand-button"
          onClick={() => {
            handleTableExpand(event, id);
            setIsExpanded(!isExpanded);
          }}
        >
          <img className="arrow" src={isExpanded ? upArrow : downArrow}></img>
        </span>
      ) : null}
    </div>
  );
};
