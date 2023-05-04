import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import { AppContext } from "../../AppContext";
import GameOver from "./GameOver";
import Settings from "./Settings";
import randomWords from "random-words";
import Account from "./Account";

const MainConsole = () => {
  //STATE
  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [words, setWords] = useState(randomWords({ exactly: 100 }));

  // CONTEXT
  const {
    gameOver,
    openGameOver,
    settingsOpen,
    openSettings,
    accountModalOpen,
    openAccountModal,
    checkboxValues,
  } = useContext(AppContext);

  console.log("checkBoxValues(mainConsole): " + checkboxValues);

  useEffect(() => {
    if (
      checkboxValues[0] === "randomWords" ||
      checkboxValues[-1] === "randomWords"
    ) {
      setWords(randomWords({ exactly: 100 }));
      setWordIndex((prevWordIndex) => prevWordIndex + 1);
    } else {
      setWords(generateStrings(checkboxValues));
    }
  }, [checkboxValues]);

  // GENERATE STRINGS FUNCTION
  function generateStrings(letters) {
    const strings = [];

    for (let i = 0; i < 100; i++) {
      const length = Math.floor(Math.random() * 13) + 3; // generate a random length between 3 and 15
      let str = [];

      for (let j = 0; j < length; j++) {
        const letterIndex = Math.floor(Math.random() * letters.length);
        str.push(letters[letterIndex]);
      }
      const strFinal = str.join("");
      strings.push(strFinal.toLowerCase());
    }

    return strings;
  }
  //////

  const totalTime = 20;

  const [letterIndex, setLetterIndex] = useState(0);
  const [matching, setMatching] = useState("");
  const [timer, setTimer] = useState(totalTime); // Timer starting value
  const [started, setStarted] = useState(false); // Flag to indicate if the game has started
  const [typedWords, setTypedWords] = useState(-2);

  console.log(words);
  console.log("gameOver: " + gameOver);

  // KEYBOARD
  const keyColors = {};
  const keyActive = {};
  const keyboardKeys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
  ];

  for (const key of keyboardKeys) {
    keyColors[key] = "#858585";
    keyActive[key] = false;
  }

  const [isActive, setIsActive] = useState(keyActive);
  const [buttonColor, setBackgroundColor] = useState(keyColors);
  /////

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!started) {
        setStarted(true);
      }

      // Check if the pressed key matches the first letter of the word
      if (event.key === currentWord[0]) {
        setCurrentWord(currentWord.slice(1));
        setMatching((prevMatching) => prevMatching + event.key);
      }

      /// Key Color Change
      for (let i = 0; i < keyboardKeys.length; i++) {
        const item = keyboardKeys[i].toLowerCase();

        switch (item) {
          case event.key:
            setBackgroundColor((prevColors) => {
              const newKeyColors = { ...prevColors };
              newKeyColors[item.toUpperCase()] = "#616161";
              return newKeyColors;
            });
            break;
        }
      }
    };

    const handlekeyUp = (event) => {
      // Key Color Change
      for (let i = 0; i < keyboardKeys.length; i++) {
        const item = keyboardKeys[i].toLowerCase();
        switch (item) {
          case event.key:
            setBackgroundColor((prevColors) => {
              const newKeyColors = { ...prevColors };
              newKeyColors[item.toUpperCase()] = "#858585";
              return newKeyColors;
            });
            break;
        }
      }
    };
    if (currentWord === "") {
      setCurrentWord((prevWord) => words[wordIndex + 1]);
      setWordIndex((prevIndex) => prevIndex + 1);
      setMatching((prevMatching) => "");
      setTypedWords((prevTyped) => prevTyped + 1);
    }

    // Add an event listener for the 'keydown' event when the component mounts
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handlekeyUp);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handlekeyUp); // Fixed here
    };
  }, [currentWord, started, timer]);

  useEffect(() => {
    let intervalId;

    // Start the timer when the game is started
    if (started) {
      intervalId = setInterval(() => {
        // Decrease the timer by 1 every second
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    // Clean up the interval when the component unmounts or when the game is finished
    return () => {
      clearInterval(intervalId);
    };
  }, [started]);

  const calculateWordsPerMinute = () => {
    // Calculate words per minute based on the typed words and the timer value
    if (!started) {
      return 0;
    }
    const wordsPerMinute = Math.floor((typedWords / (20 - timer)) * 60);
    return wordsPerMinute;
  };

  useEffect(() => {
    if (timer === 0) {
      openGameOver();
      setStarted(false);
      setTimer(20);
      console.log(checkboxValues);
    }
  }, [timer]);

  return (
    <div>
      <div className="App">
        {gameOver ? <GameOver typedWords={typedWords} /> : null}
        {settingsOpen ? <Settings /> : null}
        {accountModalOpen ? <Account /> : null}

        <button id="settings-button" onClick={openSettings}>
          Settings
        </button>
        <button id="account-button" onClick={openAccountModal}>
          Account
        </button>
        <div className="centered">
          <h1 id="title">Typist Dojo</h1>
        </div>
        <div id="console">
          <div id="stats">
            <div>Time Remaining: {timer}</div>
            <div>
              Average Words/minute:{" "}
              {!gameOver
                ? calculateWordsPerMinute()
                : Math.floor((typedWords / totalTime) * 60)}
            </div>
          </div>
          <div id="display">
            <span id="matching">{matching}</span>
            <span>{currentWord}</span>
          </div>
          <div className="keyboard">
            {keyboardKeys.map((key) => (
              <div
                className={isActive[key] == true ? "key active" : "key"}
                id={key}
                key={key}
                style={{ backgroundColor: buttonColor[key] }}
              >
                {key}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainConsole;