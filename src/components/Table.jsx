import React, { useState } from "react";
import { TableColumn } from "./TableColumn";
import { SplitButtonTable } from "./SplitButtonTable";
import "../css/Table.css";

export const Table = ({ childCountArray, id, filter, setFilter, options }) => {
  return (
    <>
      <div className="table" id={id}>
        <div className="table-header">
          <div>
            <SplitButtonTable setFilter={setFilter} options={options} />
          </div>
          <div>
            <span className="text">No. of Childs</span>
          </div>
        </div>
        <div className="table-body secondary-color">
          {childCountArray.length > 0 ? (
            childCountArray.map((item, index) => (
              <TableColumn
                item={item}
                filter={filter}
                setFilter={setFilter}
                id={id}
                key={index}
              />
            ))
          ) : (
            <div className="add-data">
              <span>Add data in the editor to see the result</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
