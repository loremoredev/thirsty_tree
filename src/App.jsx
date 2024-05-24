import { HomePage } from "./pages/HomePage";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function App() {
  const [customTheme, setCustomTheme] = useState("light");
  const Theme = createTheme({
    palette: {
      primary: {
        main: "#66B0B2",
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
        <HomePage
          setCustomTheme={setCustomTheme}
          customTheme={customTheme}
          Theme={Theme}
        ></HomePage>
      </ThemeProvider>
    </React.StrictMode>
  );
}
