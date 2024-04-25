import { Editor } from "./components/Editor";
import React, { useState, useEffect } from "react";
import { Test } from "./components/Test";
import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <Editor></Editor>
        <Editor></Editor>
      </div>
      <Test></Test>
    </>
  );
}

export default App;
