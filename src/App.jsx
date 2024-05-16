import { HomePage } from "./pages/HomePage";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function App() {
  const [customTheme, setCustomTheme] = useState("light");
  const manageTheme = createTheme({
    palette: {
      mode: customTheme,
    },
  });
  return (
    <React.StrictMode>
      <ThemeProvider theme={manageTheme}>
        <CssBaseline />
        <HomePage
          setCustomTheme={setCustomTheme}
          customTheme={customTheme}
        ></HomePage>
      </ThemeProvider>
    </React.StrictMode>
  );
}