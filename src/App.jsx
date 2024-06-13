// import { HomePage } from "./pages/HomePage";
// import React, { useState, useEffect } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import BuilderPage from "./builder-page";
import { Routes, Route } from "react-router-dom";
import HomePage from "./home-page";
import ThirstyTree from "./ThirstyTree";

// export default function App() {
function App() {
  // const [customTheme, setCustomTheme] = useState("light");
  // const Theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#66B0B2",
  //       light: "#AEE0E4",
  //       // dark: will be calculated from palette.primary.main,
  //       // contrastText: "#3e7674",
  //     },
  //     secondary: {
  //       main: "#E0C2FF",
  //       light: "#F5EBFF",
  //       // dark: will be calculated from palette.secondary.main,
  //       contrastText: "#47008F",
  //     },
  //     tertiary: {
  //       main: "#3e7674",
  //     },
  //   },
  // });
  return (
    // <React.StrictMode>
    // <ThemeProvider theme={Theme}>
    //   <CssBaseline />
    //   <HomePage
    //     setCustomTheme={setCustomTheme}
    //     customTheme={customTheme}
    //     Theme={Theme}
    //   ></HomePage>
    // </ThemeProvider>
    // </React.StrictMode>
    <>
      <h1>Welcome to the world of JSON ... a thirsty tree ...</h1>
      <Routes>
        // Add route here
        {/* <switch> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/builder-demo" element={<BuilderPage />} />
        <Route path="/thirsty-tree" element={<ThirstyTree />} />
        {/*   <Route
            path="/"
            component={
              <React.StrictMode>
                <ThemeProvider theme={Theme}>
                  <CssBaseline />
                  <HomePage
                    setCustomTheme={setCustomTheme}
                    customTheme={customTheme}
                    Theme={Theme}
                  ></HomePage>
                </ThemeProvider>
              </React.StrictMode>
            }
          />  */}
        {/* </switch> */}
        // Add your other routes
      </Routes>
    </>
  );
}

export default App;
