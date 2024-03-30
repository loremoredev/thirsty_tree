import React, { useEffect, useRef, useState } from "react";
import { renderCodeMirror } from "../modules/codemirror";
import { getFirstLevelChildren } from "../modules/codemirror";
import Button from "@mui/material/Button";
import "../css/Editor.css";
export const Editor = () => {
  const textareaRef = useRef(null);
  const [view, setView] = useState(null);
  const [textareaData, setTextareaData] = useState("");
  const data = {
    parent: {
      child1: {
        name: "Child 1",
        age: 5,
      },
      child2: {
        name: "Child 2",
        age: 8,
      },
      child3: {
        name: "Child 3",
        age: 11,
      },
      child4: {
        name: "Child 4",
        age: 7,
      },
      child5: {
        name: "Child 5",
        age: 9,
      },
    },
    parent2: {
      child1: {
        name: "Child 1",
        age: 5,
      },
    },
    parent3: {
      child1: {
        name: "Child 1",
        age: 5,
      },
    },
  };
  useEffect(() => {
    if (textareaRef.current) {
      const editorView = renderCodeMirror(textareaRef.current);
      setView(editorView);
    }
  }, [textareaRef]);
  const updateEditor = () => {
    try {
      let transaction = view.state.update({
        changes: { from: 0, insert: JSON.stringify(data, null, 2) }, // Pass data directly without stringifying
      });
      view.dispatch(transaction);
    } catch (error) {
      console.error("Error occurred while dispatching transaction:", error);
    }
  };
  return (
    <div className="container">
      <div className="editor-container">
        <textarea className="codemirror-editor" ref={textareaRef}></textarea>
        <textarea className="output" value={textareaData}></textarea>
      </div>
      <div className="button-container">
        <Button variant="contained" color="secondary" onClick={updateEditor}>
          Print Json
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setTextareaData(view.state.doc.toString());
          }}
        >
          Log JSON
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setTextareaData(view.state.doc.lines);
          }}
        >
          Total Lines
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setTextareaData(
              view.state.sliceDoc(
                view.state.selection.main.from,
                view.state.selection.main.to
              )
            );
          }}
        >
          Print selected
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            getFirstLevelChildren(JSON.parse(view.state.doc));
          }}
        >
          First Level of Children
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setTextareaData(view.state.selection.main.head);
          }}
        >
          Get Cursor
        </Button>
      </div>
    </div>
  );
};
