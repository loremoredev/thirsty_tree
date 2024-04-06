import { basicSetup } from "codemirror";
import {
  EditorView,
  GutterMarker,
  gutter,
  lineNumbers,
} from "@codemirror/view";
import { ensureSyntaxTree, foldAll, foldable } from "@codemirror/language";
import {
  EditorState,
  StateEffect,
  StateField,
  RangeSet,
} from "@codemirror/state";
import { json } from "@codemirror/lang-json";

export const renderCodeMirror = (textareaElement) => {
  const view = new EditorView({
    state: EditorState.create({
      doc: textareaElement.value,

      extensions: [
        updateListernerExtension,
        basicSetup,
        json(),
        EditorState.tabSize.of(2),
      ],
    }),
    parent: textareaElement.parentElement,
  });

  textareaElement.style.display = "none";
  return view;
};
let countArray = [0];
let updateListernerExtension = EditorView.updateListener.of((view) => {
  if (view.docChanged) {
    countArray = [0];
    const firstLevelChildrenKeys = getFirstLevelChildren(
      JSON.parse(view.state.doc)
    );
    console.log(firstLevelChildrenKeys);
    // console.log(view.state.length);
    // getFoldGutterLineNumbers(view);
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
      // Create a new span element
      const newSpan = document.createElement("span");
      // Set the text content of the new span to "New Span
      newSpan.textContent = countArray[index] || "error";
      const oldSpan = span.previousElementSibling;
      if (oldSpan && oldSpan.tagName === "SPAN") {
        span.parentNode.removeChild(oldSpan);
      }
      // console.log(firstLevelChildrenKeys);
      // Insert the new span before the current span
      span.insertAdjacentElement("beforebegin", newSpan);
    });
  }
});
export const getFoldGutterLineNumbers = (update) => {
  let tree = ensureSyntaxTree(update.state.doc, update.state.doc.lines, 5000);
  console.log(tree);
};

export const getFirstLevelChildren = (data) => {
  let count = 0;

  Object.values(data).forEach((value) => {
    if (typeof value !== null) {
      count++;
    }
  });
  if (count !== null) {
    output.value += `Count: ${count}\n`;
    countArray.push(count);
  }

  const firstLevelChildrenKeys = Object.keys(data).filter(
    (key) => typeof data[key] === "object"
  );
  firstLevelChildrenKeys.forEach((key) => {
    // Call the getFirstLevelChildren function for each element
    getFirstLevelChildren(data[key]);
  });
  return countArray;
};

const emptyMarker = new (class extends GutterMarker {
  toDOM() {
    firstLevelChildrenKeys.forEach((element) => {
      return document.createTextNode(element);
    });
  }
})();

const emptyLineGutter = [
  gutter({
    lineMarker(view, line) {
      return line.from !== line.to ? emptyMarker : null;
    },
    // initialSpacer: () => emptyMarker,
    // // updateSpacer: (emptyMarker, view) =>
    // //   view.dispatch({ effects: StateEffect.reconfigure.of(test) }),
    class: "cm-breakpoint-gutter",
    initialSpacer: () => emptyMarker,
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      paddingLeft: "5px",
      color: "red",
      cursor: "pointer",
    },
  }),
];
//coda, notion
