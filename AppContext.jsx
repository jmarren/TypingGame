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
  const [checkboxValues, setCheckboxValues] = useState(["randomWords"]);
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [gameReady, setGameReady] = useState(true);
  //   const [typedWords, setTypedWords ] = useState(0)
  const [totalTime, setTotalTime] = useState(60);

  const [newGame, setNewGame] = useState(false);

  const closeGameOver = () => {
    setGameOver(false);
    setGameReady(true);
  };

  const openGameOver = () => {
    setGameReady(false);
    setGameOver(true);
  };

  const openSettings = () => {
    setSettingsOpen(true);
    setGameReady(false);
  };
  const closeSettings = () => {
    setSettingsOpen(false);
    setGameReady(true);
  };

  const openAccountModal = () => {
    setAccountModalOpen(true);
  };

  const closeAccountModal = () => {
    setAccountModalOpen(false);
  };

  const signUserIn = () => {
    setSignedIn(true);
  };

  const signUserOut = () => {
    setSignedIn(false);
  };

  const changeTime = (time) => {
    setTotalTime(time);
  };

  // Provide the context value
  const contextValue = {
    gameOver,
    setGameOver,
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
    wordIndex,
    setWordIndex,
    gameReady,
    setGameReady,
    signUserIn,
    signUserOut,
    changeTime,
    totalTime,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
