import {
  foldService,
  foldEffect,
  unfoldAll,
  unfoldEffect,
  foldAll,
} from "@codemirror/language";

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
          level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th"
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

export const handleTableExpand = (event, id) => {
  const parent = event.target.closest(".table-row");
  if (parent.firstElementChild.innerText === "root") {
    const table = document.getElementById(`${id}`);
    const tableRows = table.querySelectorAll(".table-row");

    tableRows.forEach((row) => {
      const tableDataLeft = row.firstElementChild;
      if (tableDataLeft.textContent.includes("1 st level parent")) {
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

export const getFoldingRangesByIndent = (state, from, to) => {
  const line = state.doc.lineAt(from); // First line
  const lines = state.doc.lines; // Number of lines in the document
  const indent = line.text.search(/\S|$/); // Indent level of the first line
  let foldStart = from; // Start of the fold
  let foldEnd = to; // End of the fold

  // Check the next line if it is on a deeper indent level
  // If it is, check the next line and so on
  // If it is not, go on with the foldEnd
  let nextLine = line;
  while (nextLine.number < lines) {
    nextLine = state.doc.line(nextLine.number + 1); // Next line
    const nextIndent = nextLine.text.search(/\S|$/); // Indent level of the next line

    // If the next line is on a deeper indent level, add it to the fold
    if (nextIndent > indent) {
      foldEnd = nextLine.to; // Set the fold end to the end of the next line
    } else {
      break; // If the next line is not on a deeper indent level, stop
    }
  }

  // If the fold is only one line, don't fold it
  if (state.doc.lineAt(foldStart).number === state.doc.lineAt(foldEnd).number) {
    return null;
  }

  // Set the fold start to the end of the first line
  // With this, the fold will not include the first line
  foldStart = line.to;

  // Return a fold that covers the entire indent level
  return { from: foldStart, to: foldEnd };
};

export function foldOnIndentLvl(
  view,
  indentLevel,
  index,
  childArray,
  setNumofLevelChild
) {
  let flag = true;
  const state = view.state;
  const doc = state.doc;
  const foldingRanges = [];
  // if (indentLevel === 0) {
  //   console.log(indentLevel);
  //   hide ? foldAll(view) : unfoldAll(view);
  //   return 0;
  // }
  // Loop through all lines of the editor doc
  const numberOfLines = doc.lines;
  for (let line = 1; line < numberOfLines; line++) {
    const lineStart = doc.line(line).from;
    const lineEnd = doc.line(line).to;

    // Get folding range of line
    const foldingRange = getFoldingRangesByIndent(state, lineStart, lineEnd);

    // If folding range found, add it to the array
    if (foldingRange) {
      foldingRanges.push(foldingRange);
    }
  }

  // Loop through all folding ranges
  for (const foldingRange of foldingRanges) {
    const line = doc.lineAt(foldingRange.from); // Get line from folding start position
    const lineIntendation = line.text.match(/^\s*/)?.[0].length; // Get intendation of line
    if (childArray[index][2].hidden === true) {
      if (lineIntendation < indentLevel || lineIntendation === indentLevel) {
        view.dispatch({
          effects: unfoldEffect.of({
            from: foldingRange.from,
            to: foldingRange.to,
          }),
        });
      }
      if (flag) {
        setNumofLevelChild((prevNumofLevelChild) =>
          prevNumofLevelChild.map((item, idx) =>
            index >= idx ? [...item.slice(0, 2), { hidden: false }] : item
          )
        );
        flag = false;
      }
    } else {
      if (lineIntendation === indentLevel) {
        view.dispatch({
          effects: foldEffect.of({
            from: foldingRange.from,
            to: foldingRange.to,
          }),
        });
      }
      if (flag) {
        setNumofLevelChild((prevNumofLevelChild) =>
          prevNumofLevelChild.map((item, idx) =>
            index === idx
              ? [...item.slice(0, 2), { hidden: !item[2].hidden }]
              : item
          )
        );
        flag = false;
      }
    }

    // If line has no intendation or intendation is smaller than the indent level, continue (don't fold)
    // if (lineIntendation || lineIntendation === indentLevel) {
    //   continue;
    // }
    // childArray[index][2].hidden &&
    //   // Fold the given range
    //   view.dispatch({
    //     effects: foldEffect.of({
    //       from: foldingRange.from,
    //       to: foldingRange.to,
    //     }),
    //   });
  }
}
