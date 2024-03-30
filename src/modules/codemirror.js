import { basicSetup } from "codemirror";
import {
  EditorView,
  GutterMarker,
  gutter,
  lineNumbers,
} from "@codemirror/view";
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
let test = 0;
let updateListernerExtension = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    getFirstLevelChildren(JSON.parse(update.state.doc));
    console.log(test);
    document.querySelector(".output").innerHTML = test;
  }
});
export const getFirstLevelChildren = (data) => {
  const firstLevelChildrenKeys = Object.keys(data).filter(
    (key) => typeof data[key] === "object"
  );
  test = firstLevelChildrenKeys.length;
};

const emptyMarker = new (class extends GutterMarker {
  toDOM() {
    return document.createTextNode(test);
  }
})();
const emptyLineGutter = [
  gutter({
    //   return line.from === line.to ? emptyMarker : null;
    // },
    // initialSpacer: () => emptyMarker,
    // // updateSpacer: (emptyMarker, view) =>
    // //   view.dispatch({ effects: StateEffect.reconfigure.of(test) }),
    class: "cm-breakpoint-gutter",
    initialSpacer: () => emptyMarker,
    domEventHandlers: {
      mousedown(view, line) {
        const data1 = JSON.parse(view.state.doc);
        const firstLevelChildrenKeys = Object.keys(data1).filter(
          (key) => typeof data1[key] === "object"
        );
        test = firstLevelChildrenKeys.length;
        console.log(test);
        let trans = view.state.update({ changes: { from: 0, insert: test } });
        view.dispatch(trans);
        return true;
      },
    },
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "red",
      cursor: "pointer",
    },
  }),
];
//coda, notion
