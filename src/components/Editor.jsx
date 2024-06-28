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
import { json2csv } from "json-2-csv";
import exportFromJSON from "export-from-json";
import csvDownload from "json-to-csv-export";

const exportType = exportFromJSON.types.csv;
import jmespath from "jmespath";
// import QuickAction from "./QuickAction";

export const Editor = ({ id }) => {
  const [childCountArray, setChildCountArray] = useState([]);
  const [filter, setFilter] = useState("");
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
  const data = {
    ctRoot: [
      {
        _id: "FUNMA6Q0VCNQIYPO",
        name: "Jeane Muhammad",
        dob: "2015-05-29",
        address: {
          street: "6887 Irvine Road",
          town: "Mexborough",
          postode: "PR09 5YR",
        },
        telephone: "+212-6919-387-694",
        pets: ["Cali", "Oliver"],
        score: 2.1,
        email: "vannesa-crook0@sofa.com",
        url: "http://www.backed.com",
        description:
          "considered preparing decide lit etc depression downloading bra keep rose ru hotels nurses styles soa supposed guess judges disciplines resistance",
        verified: true,
        salary: 64370,
      },
      {
        _id: "R3VAH6QLAI6LC3Y0",
        name: "Fawn Waters",
        dob: "2022-06-11",
        address: {
          street: "6158 Ledgard Circle",
          town: "Basingstoke",
          postode: "E85 8IT",
        },
        telephone: "+53-8208-009-605",
        pets: ["Kiki", "Emma"],
        score: 7,
        email: "suzan_obryan@hotmail.com",
        url: "http://agricultural.com",
        description:
          "urls jungle popularity magic david jp jade equilibrium amateur options ye virtual adjust anything wto weights gothic betting ecommerce moment",
        verified: true,
        salary: 32885,
      },
    ],
  };
  const fileName = "download";
  function exportToCSV() {
    const transformedData = Array.isArray(data)
      ? data
      : Object.keys(data).map((key) => ({ key, value: data[key] }));
    exportFromJSON({ transformedData, fileName, exportType });
  }
  const formatOptions = {
    indent: 4,
  };
  const dataToConvert = {
    data: data,
    filename: "export",
    delimiter: ",",
  };
  // const exportToCSV = () => {
  //   try {
  //     const csv = json2csv(data);
  //     console.log(csv);
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   fsync.writeFile("data.csv", csv, (err) => {
  //     if (err) console.log(err);
  //     else console.log("file saved");
  //   });
  // };
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
            <Button variant="contained" onClick={exportToCSV}>
              Export CSV
            </Button>
          </div>
          <div ref={editor} className="editor"></div>
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
