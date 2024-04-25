import "../css/Editor.css";
import { EditorView, lineNumbers } from "@codemirror/view";

import { EditorState } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { foldGutter } from "./foldGutter.js";
export const renderCodeMirror = (textareaElement) => {
  const view = new EditorView({
    state: EditorState.create({
      doc: textareaElement.value,

      extensions: [
        updateListernerExtension,
        foldGutter(),
        lineNumbers(),
        json(),
        EditorState.tabSize.of(2),
      ],
    }),
    parent: textareaElement.parentElement,
  });

  textareaElement.style.display = "none";
  return view;
};

let countArray;
let updateListernerExtension = EditorView.updateListener.of((view) => {
  if (view.docChanged) {
    document.querySelectorAll(".table-row").forEach((row) => row.remove());
    getFirstLevelChildren(JSON.parse(view.state.doc));
    countChildren(JSON.parse(view.state.doc));

    const tableRow = document.querySelectorAll(".table-row");
    tableRow.forEach((row) => {
      const tableDataLeft = row.firstElementChild;
      const buttonSpan = document.createElement("span");
      if (tableDataLeft.textContent === "root") {
        buttonSpan.textContent = "⌄";
        buttonSpan.classList.add("expand-button");
        row.appendChild(buttonSpan);
      } else if (tableDataLeft.textContent.includes("parent")) {
        buttonSpan.textContent = "⌄";
        buttonSpan.classList.add("expand-button");
        row.appendChild(buttonSpan);
        row.classList.add("hidden");
      } else row.classList.add("hidden");
    });

    const expandButton = document.querySelectorAll(".expand-button");
    expandButton.forEach((button) => {
      button.addEventListener("click", function () {
        let parent = this.closest(".table-row");
        if (parent.textContent.includes("root")) {
          const tableRows = document.querySelectorAll(".table-row");
          tableRows.forEach((row) => {
            const tableDataLeft = row.firstElementChild;
            if (tableDataLeft.textContent === "1st level parent") {
              if (row.classList.contains("hidden")) {
                row.classList.remove("hidden");
              } else {
                row.classList.add("hidden");
              }
            }
          });
        } else {
          const tableRows = document.querySelectorAll(".table-row");
          const text = parent.firstElementChild.textContent;
          console.log(text);
          let tempParent = parent;
          console.log(tempParent);
          let removeHidden = true;
          tableRows.forEach((row) => {
            let parent2 = tempParent.nextElementSibling;
            if (parent2) {
              console.log(parent2);
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
      });
    });

    // while (parent2 && !parent2.textContent.includes("parent")) {
    //   if (parent2.classList.contains("hidden")) {
    //     parent2.classList.remove("hidden");
    //   } else {
    //     parent2.classList.add("hidden");
    //   }
    //   parent2 = parent2.nextElementSibling;
    // }
    //   });
    // });
    const spansWithTitleFoldAndNumber = document.querySelectorAll(
      'span[title="Fold line"], span[title="Unfold line"]'
    );
    spansWithTitleFoldAndNumber.forEach((span) => {
      const oldSpan = span.previousElementSibling;
      if (oldSpan && oldSpan.tagName === "SPAN") {
        span.parentNode.removeChild(oldSpan);
      }
    });
    spansWithTitleFoldAndNumber.forEach((span, index) => {
      const newSpan = document.createElement("span");
      newSpan.classList.add("test");
      newSpan.textContent = countArray[index] || "error";
      const oldSpan = span.previousElementSibling;
      if (oldSpan && oldSpan.tagName === "SPAN") {
        span.parentNode.removeChild(oldSpan);
      }
      // Insert the new span before the current span
      span.insertAdjacentElement("beforebegin", newSpan);
    });

    // const marginTopArray = [];
    // const foldGutter = document.querySelector(".cm-foldGutter");
    // const foldGutterChildDiv = foldGutter.querySelectorAll(".cm-gutterElement");

    // foldGutterChildDiv.forEach((div) => {
    //   const computedStyle = window.getComputedStyle(div);
    //   const marginTop = computedStyle.getPropertyValue("margin-top");
    //   marginTopArray.push(marginTop);
    // });
    // const lineNumberGutter = document.querySelector(".cm-gutters");
    // const newDiv = document.createElement("div");
    // lineNumberGutter.appendChild(newDiv);
    // marginTopArray.forEach((value, index) => {
    //   const newSpan = document.createElement("div");
    //   newSpan.textContent = countArray[index] || null;
    //   newSpan.style.marginTop = value; // Set margin-top property
    //   // Append the span to your desired container element
    //   // For example, assuming you have a container with id 'container'
    //   newDiv.appendChild(newSpan);
    // });
  }
});

let allLevelArray = [];
countArray = [0];
let addRoot = true;
export const getFirstLevelChildren = (data) => {
  let count = 0;
  let keyArray = [];

  Object.keys(data).forEach((key) => {
    keyArray.push(key);
    count++;
  });
  if (count !== null) {
    if (addRoot) {
      const tableBody = document.querySelector(".table-body");
      const tableRow = document.createElement("div");
      tableRow.classList.add("table-row");
      const tableDataLeft = document.createElement("div");
      tableDataLeft.textContent = "root";
      const tableDataRight = document.createElement("div");
      tableDataRight.textContent = count; // Display the value
      tableRow.appendChild(tableDataLeft); // Append tableDataLeft to tableRow
      tableRow.appendChild(tableDataRight); // Append tableDataRight to tableRow
      tableBody.appendChild(tableRow);
      addRoot = false;
    }

    allLevelArray.push([...keyArray]); // Pushing a copy of keyArray to allLevelArray
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

function countChildren(jsonObj, level = 1, prefix = "", result = {}) {
  addRoot = true;
  for (const key in jsonObj) {
    const currentPrefix = prefix
      ? `${prefix}-parent${level}`
      : `parent${level}`;
    if (typeof jsonObj[key] === "object" && jsonObj[key] !== null) {
      const tableBody = document.querySelector(".table-body");
      const tableRow = document.createElement("div");
      tableRow.classList.add("table-row");
      tableRow.setAttribute("id", level);
      const tableDataLeft = document.createElement("div");
      tableDataLeft.textContent = `${level}st level parent`;
      const tableDataRight = document.createElement("div");
      tableDataRight.textContent = Object.keys(jsonObj[key]).length; // Display the value
      tableRow.appendChild(tableDataLeft); // Append tableDataLeft to tableRow
      tableRow.appendChild(tableDataRight); // Append tableDataRight to tableRow
      tableBody.appendChild(tableRow); // Append tableRow to tableBody
      result[currentPrefix] = Object.keys(jsonObj[key]).length;
      countChildren(jsonObj[key], level + 1, currentPrefix, result);
    } else {
      const tableBody = document.querySelector(".table-body");
      const tableRow = document.createElement("div");
      tableRow.classList.add("table-row");
      const tableDataLeft = document.createElement("div");
      tableDataLeft.textContent = "child";
      const tableDataRight = document.createElement("div");
      tableDataRight.textContent = 0; // Display the value
      tableRow.appendChild(tableDataLeft); // Append tableDataLeft to tableRow
      tableRow.appendChild(tableDataRight); // Append tableDataRight to tableRow
      tableBody.appendChild(tableRow); // Append tableRow to tableBody
      result[currentPrefix] = 0;
    }
  }
  return result;
}
