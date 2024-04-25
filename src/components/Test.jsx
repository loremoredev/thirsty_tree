import React, { useRef, useEffect } from "react";

import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { foldGutter } from "../modules/foldGutter";
import { json } from "@codemirror/lang-json";
export const Test = () => {
  const editor = useRef();
  let updateListernerExtension = EditorView.updateListener.of((view) => {
    if (view.docChanged) {
      console.log("working");
    }
  });
  useEffect(() => {
    const startState = EditorState.create({
      doc: "Hello World",
      extensions: [
        keymap.of(defaultKeymap),
        foldGutter(),
        lineNumbers(),
        json(),
        updateListernerExtension,
      ],
    });

    const view = new EditorView({ state: startState, parent: editor.current });

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editor}></div>;
};
