import React from "react";
import { TableColumn } from "./TableColumn";
import "../css/Table.css";

export const Table = () => {
  return (
    <>
      <div className="table">
        <div className="table-header">
          <div>Parent</div>
          <div>No. of Childs</div>
        </div>
        <div className="table-body">
          {/* {Object.entries(result).map(([key, value]) => (
            <TableColumn parent={key} child={value} />
          ))} */}
        </div>
      </div>
    </>
  );
};
