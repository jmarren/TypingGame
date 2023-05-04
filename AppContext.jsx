import React, { useState, createContext } from "react";
import { auth } from "./src/config/firebase";
// Create Context
export const AppContext = createContext();

// Create Provider
export const AppProvider = ({ children }) => {
  const [gameOver, setGameOver] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [checkboxValues, setCheckboxValues] = useState("randomWords");
  const [words, setWords] = useState([]);

  const closeGameOver = () => {
    setGameOver(false);
  };

  const openGameOver = () => {
    setGameOver(true);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };
  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const openAccountModal = () => {
    setAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setAccountModalOpen(false);
  };

  // Provide the context value
  const contextValue = {
    gameOver,
    closeGameOver,
    openGameOver,
    settingsOpen,
    openSettings,
    closeSettings,
    accountModalOpen,
    openAccountModal,
    closeAccountModal,
    signedIn,
    checkboxValues,
    setCheckboxValues,
    words,
    setWords,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};