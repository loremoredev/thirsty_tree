import React, { useState } from "react";
import { TableColumn } from "./TableColumn";
import { SplitButton } from "./SplitButton";
import downArrow from "../images/downArrow.svg";
import "../css/Table.css";

export const Table = ({ childCountArray }) => {
  const [filter, setFilter] = useState("root");
  const firstIndexElements = childCountArray.map((arr) => arr[0][0]);
  console.log(firstIndexElements);
  const options = firstIndexElements.filter(
    (element, index, array) => array.indexOf(element) === index
  );
  console.log(options);

  return (
    <>
      <div className="table">
        <div className="table-header">
          <div>
            {/* Parent
            {childCountArray.length > 0 && (
              <span>
                <img src={downArrow} className="arrow" />
              </span>
            )} */}
            <SplitButton setFilter={setFilter} options={options} />
          </div>
          <div>
            <span>No. of Childs</span>
          </div>
        </div>
        <div className="table-body">
          {childCountArray.length > 0 ? (
            childCountArray.map((item) => (
              <TableColumn item={item} filter={filter} />
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
