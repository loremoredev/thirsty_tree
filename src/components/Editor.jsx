import React, { useRef, useEffect } from "react";
import { Table } from "./Table";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { foldGutter } from "../modules/foldGutter";
import { json } from "@codemirror/lang-json";
import { basicSetup } from "codemirror";
import { getFirstLevelChildren, countChildren } from "../modules/codemirror";
import { useState } from "react";
import "../css/Editor.css";
export const Editor = () => {
  const [childCountArray, setChildCountArray] = useState([]);

  const editor = useRef();
  let updateListernerExtension = EditorView.updateListener.of((view) => {
    if (view.docChanged) {
      getFirstLevelChildren(JSON.parse(view.state.doc));
      setChildCountArray(countChildren(JSON.parse(view.state.doc)));
    }
  });

  useEffect(() => {
    const startState = EditorState.create({
      doc: " ",
      extensions: [
        keymap.of(defaultKeymap),
        basicSetup,
        json(),
        updateListernerExtension,
      ],
    });

    const view = new EditorView({ state: startState, parent: editor.current });
    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div className="editor-container">
      <div ref={editor}></div>
      <Table childCountArray={childCountArray}></Table>
    </div>
  );
};
