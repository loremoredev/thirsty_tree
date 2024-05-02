let countArray;
let allLevelArray = [];
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
  console.log(allLevelArray);
  return allLevelArray;
};

export const handleTableExpand = (event, id) => {
  const parent = event.target.closest(".table-row");
  if (parent.textContent.includes("root")) {
    const table = document.getElementById(`${id}`);
    const tableRows = table.querySelectorAll(".table-row");
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
    let nextLevelParentText = "";
    if (text === "1 st level parent") nextLevelParentText = "2 nd level parent";
    else if (text === "2 nd level parent")
      nextLevelParentText = "3 rd level parent";
    else {
      const level = Number(text[0]);
      nextLevelParentText = `${level + 1} th level parent`;
    }

    let tempParent = parent;
    let removeHidden = true;

    const table = document.getElementById(`${id}`);
    const tableRows = table.querySelectorAll(".table-row");
    tableRows.forEach((row) => {
      let parent2;
      if (tempParent.nextElementSibling)
        parent2 = tempParent.nextElementSibling;
      else return;
      if (parent2) {
        if (parent2.firstElementChild.textContent === text) {
          removeHidden = false;
          return;
        }
        if (removeHidden) {
          console.log(nextLevelParentText);
          // if (
          //   parent2.firstElementChild.textContent === nextLevelParentText ||
          //   "child"
          // ) {
          if (parent2.classList.contains("hidden")) {
            parent2.classList.remove("hidden");
          } else {
            parent2.classList.add("hidden");
          }
        }
        // }
      }
      tempParent = parent2;
    });
  }
};
