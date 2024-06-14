// import { HomePage } from "./pages/HomePage";
// import React, { useState, useEffect } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import BuilderPage from "./builder-page";
import ThirstyTree from "./ThirstyTree";

// export default function App() {
function App() {
  return (
    <>
      <h1>Welcome to the world of JSON ... a thirsty tree ...</h1>
      <Routes>
        // Add route here
        <Route path="/" element={<ThirstyTree />} />
        <Route path="/blog" element={<BuilderPage />} />
        <Route path="/thirsty-tree" element={<ThirstyTree />} />
        // Add your other routes
      </Routes>
    </>
  );
}

export default App;
