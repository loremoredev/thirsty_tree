let countArray;
let allLevelArray = [];

export const handleTableExpand = (event) => {
  const parent = event.target.closest(".table-row");
  if (parent.textContent.includes("root")) {
    const tableRows = document.querySelectorAll(".table-row");
    tableRows.forEach((row) => {
      const tableDataLeft = row.firstElementChild;
      if (tableDataLeft.textContent === "1 st level parent") {
        if (row.classList.contains("hidden")) {
          row.classList.remove("hidden");
        } else {
          row.classList.add("hidden");
        }
      }
    });
  } else {
    const text = parent.firstElementChild.textContent;
    let tempParent = parent;
    let removeHidden = true;
    const tableRows = document.querySelectorAll(".table-row");
    tableRows.forEach((row) => {
      const parent2 = tempParent.nextElementSibling;
      if (parent2) {
        if (parent2.firstElementChild.textContent === text) {
          removeHidden = false;
          return;
        }
        if (removeHidden) {
          if (parent2.classList.contains("hidden")) {
            parent2.classList.remove("hidden");
          } else {
            parent2.classList.add("hidden");
          }
        }
      }
      tempParent = parent2;
    });
  }
};

countArray = [0];
let addRoot = true;
export const getFirstLevelChildren = (data) => {
  let count = 0;

  let keyArray = []; // Declare keyArray inside the function

  Object.keys(data).forEach((key) => {
    count++;
  });

  if (count !== null) {
    if (addRoot) {
      allLevelArray = [];
      keyArray.push(["root", count]);
      allLevelArray.push([...keyArray]); // Push a new array containing the key-value pair
      addRoot = false;
    }

    countArray.push(count);
  }

  const firstLevelChildrenKeys = Object.keys(data).filter(
    (key) => typeof data[key] === "object" || typeof data[key] === "String"
  );

  firstLevelChildrenKeys.forEach((key) => {
    // Call the getFirstLevelChildren function for each element
    getFirstLevelChildren(data[key]);
  });

  return countArray;
};

export const countChildren = (jsonObj, level = 1, prefix = "", result = {}) => {
  addRoot = true;
  let keyArray;
  for (const key in jsonObj) {
    keyArray = [];
    const currentPrefix = prefix
      ? `${prefix}-parent${level}`
      : `parent${level}`;
    if (typeof jsonObj[key] === "object" && jsonObj[key] !== null) {
      keyArray.push([
        `${level} ${
          level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : th
        } level parent`,
        Object.keys(jsonObj[key]).length,
        key,
      ]);
      allLevelArray = [...allLevelArray, [...keyArray]];
      result[currentPrefix] = Object.keys(jsonObj[key]).length;

      countChildren(jsonObj[key], level + 1, currentPrefix, result);
    } else {
      keyArray.push(["child", 0, key]);
      allLevelArray = [...allLevelArray, [...keyArray]];
      result[currentPrefix] = 0;
    }
  }
  return allLevelArray;
};
