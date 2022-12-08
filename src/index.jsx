import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

//INTERNAL IMPORT
import "./index.css";
import App from "./App";
import { ChapterSearchProvider } from "./context/ChapterSearchContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChapterSearchProvider>
        <StyledEngineProvider injectFirst>
          <SnackbarProvider
            autoHideDuration={2000}
          >
            <App />
          </SnackbarProvider>
        </StyledEngineProvider>
      </ChapterSearchProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
