import React, { useRef, useEffect } from "react";
import { Table } from "./Table";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { basicSetup } from "codemirror";
import { getFirstLevelChildren, countChildren } from "../modules/codemirror";
import { useState } from "react";
import { SplitButtonEditor } from "./SplitButtonEditor";
import "../css/Editor.css";
import {  foldService, foldEffect } from "@codemirror/language";
import { getFoldingRangesByIndent } from "../modules/codemirror";

export const Editor = ({ id }) => {
  const [childCountArray, setChildCountArray] = useState([]);
  const [filter, setFilter] = useState("root");
   const [startState, setStartState] = useState(null);
   const [editorView, setEditorView] = useState(null);

  const editor = useRef();
  let updateListernerExtension = EditorView.updateListener.of((view) => {
    if (view.docChanged) {
      setChildCountArray([]);
      setFilter("root");
      getFirstLevelChildren(JSON.parse(view.state.doc));
      setChildCountArray(countChildren(JSON.parse(view.state.doc)));
      
    }
  });
let tabSize = new Compartment;
  useEffect(() => {
    const state = EditorState.create({
      doc: " ",
      extensions: [
        keymap.of(defaultKeymap),
        tabSize.of(EditorState.tabSize.of(4)),
        basicSetup,
        json(),
        updateListernerExtension,
        foldService.of(getFoldingRangesByIndent)
      ],
    });

    const view = new EditorView({ state: state, parent: editor.current });
    setEditorView(view);
     setStartState(state);
     
    return () => {
      view.destroy();
    };
    
  }, []);

  const options = childCountArray
    .map((arr) => arr[0][0])
    .filter((element, index, array) => array.indexOf(element) === index);


  return (
    <div className="editor-container">
      <div className="editor-widget">
         <SplitButtonEditor options = {options} editorView={editorView}></SplitButtonEditor> 
      </div>
      <div ref={editor}></div>
      <Table
        childCountArray={childCountArray}
        id={id}
        filter={filter}
        setFilter={setFilter}
        options = {options}
      ></Table>
    </div>
  );
};