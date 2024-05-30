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
import { Toast } from "./Toast";
import { Button } from "@mui/material";
import "../css/Editor.css";
import { foldService, unfoldAll } from "@codemirror/language";
import { getFoldingRangesByIndent } from "../modules/codemirror";
import jmespath from "jmespath";

export const Editor = ({ id }) => {
  const [childCountArray, setChildCountArray] = useState([]);
  const [filter, setFilter] = useState("root");
  const [startState, setStartState] = useState(null);
  const [editorView, setEditorView] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const editor = useRef();
  const options = childCountArray
    .map((arr) => arr[0][0])
    .filter((element, index, array) => array.indexOf(element) === index);

  let myTheme = EditorView.theme({
    "&": {
      color: "#3E7674",
      backgroundColor: "#E4F4E0",
    },
    ".cm-content": {
      caretColor: "#3E7674",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#3E7674",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#3E7674",
    },
    ".cm-gutters": {
      backgroundColor: "#E4F4E0",
      color: "#3E7674",
      border: " 1px dashed #66B0B2",
    },
  });
  let updateListernerExtension = EditorView.updateListener.of((view) => {
    if (view.docChanged) {
      try {
        //clickButton();
        setChildCountArray([]);
        setFilter("root");
        getFirstLevelChildren(JSON.parse(view.state.doc));
        setChildCountArray(countChildren(JSON.parse(view.state.doc)));
      } catch (error) {
        setErrorMsg(error.message);
        setOpenToast(true);
      }
    }
  });
  useEffect(() => {
    const state = EditorState.create({
      doc: " ",
      extensions: [
        keymap.of(defaultKeymap),
        basicSetup,
        json(),
        updateListernerExtension,
        foldService.of(getFoldingRangesByIndent),
        myTheme,
      ],
    });

    const view = new EditorView({ state: state, parent: editor.current });
    setEditorView(view);
    setStartState(state);

    return () => {
      view.destroy();
    };
  }, []);
  const clickButton = () => {
    const formatButton = document.querySelectorAll("#format-button");
    formatButton.forEach((button) => {
      button.click();
    });
  };
  const formatOptions = {
    indent: 4,
  };
  const formatToJson = () => {
    const docText = editorView.state.doc.toString();
    const formattedJson = fmt2json(docText);
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: formattedJson,
      },
    });
  };

  return (
    <>
      <div className="child-container">
        <div className="editor-container">
          <div className="editor-widget">
            <SplitButtonEditor
              options={options}
              editorView={editorView}
              childCountArray={childCountArray}
            ></SplitButtonEditor>
            <Button
              id="format-button"
              variant="contained"
              onClick={formatToJson}
            >
              Format
            </Button>
          </div>
          <div ref={editor}></div>
        </div>
        <Table
          childCountArray={childCountArray}
          id={id}
          filter={filter}
          setFilter={setFilter}
          options={options}
        ></Table>
      </div>
      <Toast open={openToast} setOpen={setOpenToast} message={errorMsg} />
    </>
  );
};
