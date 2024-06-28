import { HomePage } from "./pages/HomePage";
import BuilderPage from "./builder-page";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../index.css";
import { Routes, Route } from "react-router-dom";

export default function App() {
  const [customTheme, setCustomTheme] = useState("light");
  const Theme = createTheme({
    typography: {
      fontFamily: "var(--font-family)",
    },
    palette: {
      primary: {
        main: "#66b0b2",
        light: "#AEE0E4",
        // dark: will be calculated from palette.primary.main,
        // contrastText: "#3e7674",
      },
      secondary: {
        main: "#E0C2FF",
        light: "#F5EBFF",
        // dark: will be calculated from palette.secondary.main,
        contrastText: "#47008F",
      },
      tertiary: {
        main: "#3e7674",
      },
    },
  });
  return (
    <React.StrictMode>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                setCustomTheme={setCustomTheme}
                customTheme={customTheme}
                Theme={Theme}
              ></HomePage>
            }
          ></Route>
          <Route path="/blog" element={<BuilderPage />}></Route>
        </Routes>
      </ThemeProvider>
    </React.StrictMode>
  );
}
