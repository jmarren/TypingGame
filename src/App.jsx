import React from "react";
import { AppProvider } from "../AppContext";
import "./App.css";
import MainConsole from "./Components/MainConsole";

function App() {
  return (
    <AppProvider>
      <MainConsole />
    </AppProvider>
  );
}

export default App;
