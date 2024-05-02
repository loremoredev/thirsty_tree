import React, { useState } from "react";
import { TableColumn } from "./TableColumn";
import { SplitButton } from "./SplitButton";
import "../css/Table.css";

export const Table = ({ childCountArray, id, filter, setFilter }) => {
  const options = childCountArray
    .map((arr) => arr[0][0])
    .filter((element, index, array) => array.indexOf(element) === index);

  return (
    <>
      <div className="table" id={id}>
        <div className="table-header">
          <div>
            <SplitButton setFilter={setFilter} options={options} />
          </div>
          <div>
            <span className="text">No. of Childs</span>
          </div>
        </div>
        <div className="table-body">
          {childCountArray.length > 0 ? (
            childCountArray.map((item) => (
              <TableColumn
                item={item}
                filter={filter}
                setFilter={setFilter}
                id={id}
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
