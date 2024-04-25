import React, { useEffect, useRef, useState } from "react";
import { renderCodeMirror } from "../modules/codemirror";
import Button from "@mui/material/Button";
import "../css/Editor.css";
import { Table } from "./Table";
export const Editor = () => {
  const textareaRef = useRef(null);
  const [view, setView] = useState(null);
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
        data: [
          { id: 1, name: "John", age: 30 },
          { id: 2, name: "Alice", age: 25 },
          { id: 3, name: "Bob", age: 35 },
          { id: 4, name: "Emily", age: 28 },
        ],
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
    <div className="editor-container">
      <div className="codemirror-editor">
        <textarea ref={textareaRef}></textarea>
      </div>

      {/* <textarea className="output" id="output"></textarea> */}

      <div className="button-container">
        <Button variant="contained" color="secondary" onClick={updateEditor}>
          Print Json
        </Button>
        {/* <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            getFoldGutterLineNumbers(view);
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
            countChildren(view.state.doc);
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
        </Button> */}
      </div>

      <Table></Table>
    </div>
  );
};
