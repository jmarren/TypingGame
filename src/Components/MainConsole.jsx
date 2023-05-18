import React, { useEffect, useState, useContext, useMemo } from "react";
import "../App.css";
import { AppContext } from "../../AppContext";
import GameOver from "./GameOver";
import Settings from "./Settings";
import randomWords from "random-words";
import Account from "./Account";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc, doc } from "firebase/firestore";

const MainConsole = () => {
  ////////////////////////////////  CONTEXT  ////////////////////////////////////////
  const {
    gameOver,
    openGameOver,
    settingsOpen,
    openSettings,
    accountModalOpen,
    openAccountModal,
    checkboxValues,
    wordIndex,
    setWordIndex,
    gameReady,
    signedIn,
    signUserIn,
    totalTime,
  } = useContext(AppContext);

  //////////////////////////////// CONSTANTS  /////////////////////////////////////
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
  const KEYACTIVE = {};
  const KEYCOLORS = {};
  for (const key of keyboardKeys) {
    KEYCOLORS[key] = "#858585";
    KEYACTIVE[key] = false;
  }

  /////////////////////////////////  STATE  /////////////////////////////////////////
  const [currentWord, setCurrentWord] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [words, setWords] = useState(randomWords({ exactly: 100 }));
  const [matching, setMatching] = useState("");
  //const [highScore, setHighScore] =  useState(0);
  const [wrongKey, setWrongKey] = useState("");
  const [isActive, setIsActive] = useState(KEYACTIVE);
  const [buttonColor, setBackgroundColor] = useState(KEYCOLORS);
  const [letterIndex, setLetterIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [typedWords, setTypedWords] = useState(-1);
  const [allIncorrect, setAllIncorrect] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [timer, setTimer] = useState(totalTime);
  const wordsPerMinuteFinal = Math.floor((typedWords / totalTime) * 60);
  //////////////////////////////////// FUNCTIONS //////////////////////////////////

  const NextWord = () => {
    setWordIndex((prevIndex) => prevIndex + 1);
    setCurrentWord(() => words[0]);
    setMatching(() => "");
  };

  // -------------------

  const generateStrings = (letters) => {
    const strings = [];

    for (let i = 0; i < 100; i++) {
      const length = Math.floor(Math.random() * 13) + 3;
      let str = [];

      for (let j = 0; j < length; j++) {
        const letterIndex = Math.floor(Math.random() * letters.length);
        str.push(letters[letterIndex]);
      }
      const strFinal = str.join("");
      strings.push(strFinal.toLowerCase());
    }
    return strings;
  };

  // -------------------

  const changeWordsArray = () => {
    if (
      checkboxValues[0] === "randomWords" ||
      checkboxValues[-1] === "randomWords"
    ) {
      setWords(randomWords({ exactly: 100 }));
    } else {
      setWords(generateStrings(checkboxValues));
    }
  };

  // -------------------

  const checkInput = (keyPressed) => {
    if (!gameOver) {
      if (wrongKey == "") {
        if (keyPressed === currentWord[0]) {
          setCurrentWord(currentWord.slice(1));
          setMatching((prevMatching) => prevMatching + keyPressed);
        } else if (keyboardKeys.includes(keyPressed.toUpperCase())) {
          setWrongKey((prevWrong) => prevWrong + keyPressed);
          setAllIncorrect((prevIncorrect) => [...prevIncorrect, keyPressed]);
        }
      }

      if (wrongKey !== "") {
        if (keyPressed === "Backspace") {
          setWrongKey((prevWrong) => prevWrong.slice(0, -1));
        } else if (keyboardKeys.includes(keyPressed.toUpperCase())) {
          setWrongKey((prevWrong) => prevWrong + keyPressed);
          setAllIncorrect((prevIncorrect) => [...prevIncorrect, keyPressed]);
        }
      }
    }
  };

  // -------------------

  const handleKeyPress = (event) => {
    if (!started && gameReady) {
      setStarted(true);
    }

    const keyPressed = event.key;

    checkInput(keyPressed);

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

  // -------------------

  const handleKeyUp = (event) => {
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

  // -------------------

  const ResetGame = () => {
    if (gameReady) {
      setTimer(totalTime);
      setTypedWords(0);
      setCurrentWord(words[wordIndex + 1]);
      setMatching("");
      setWrongKey("");
      setAllIncorrect([]);
    }
  };

  // -------------------

  const StartTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setIntervalId(id);
  };

  // -------------------

  const StopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  // -------------------

  const calculateWordsPerMinute = () => {
    // Calculate words per minute based on the typed words and the timer value
    if (!started) {
      return 0;
    }
    const wordsPerMinute = Math.floor((typedWords / (totalTime - timer)) * 60);
    return wordsPerMinute;
  };

  //////////////////////////////////////  EFFECTS  ///////////////////////////////////

  useEffect(() => {
    if (timer === 0) {
      openGameOver();
      setStarted(false);
      setTimer(totalTime);
      StopTimer();
    }
  }, [timer]);

  useEffect(() => {
    setCurrentWord(words[0]);
    setTimer(totalTime);
  }, [words]);

  useEffect(() => {
    NextWord();
  }, [words, gameReady]);

  // -------------------

  useEffect(() => {
    changeWordsArray();
  }, [checkboxValues]);

  // -------------------

  useEffect(() => {
    if (currentWord === "") {
      setCurrentWord(() => words[wordIndex + 1]);
      setWordIndex((prevIndex) => prevIndex + 1);
      setMatching(() => "");
      if (!gameOver) {
        setTypedWords((prevTyped) => prevTyped + 1);
      }
    }
  }, [currentWord]);

  // -------------------

  //   useEffect(() => {
  //     setTimer(totalTime);
  //   }, [totalTime]);

  // -------------------

  useEffect(() => {
    // Add an event listener for the 'keydown' event when the component mounts
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentWord, wrongKey]);

  // -------------------

  useEffect(() => {
    if (started) {
      StartTimer();
    }
  }, [started]);

  // -------------------

  useEffect(() => {
    if (gameReady) {
      ResetGame();
    }
  }, [gameReady]);

  useEffect(() => {
    if (auth?.currentUser?.uid !== null) {
      signUserIn();
    }
  }, []);

  /// ==============================  DEBUG LOGS  ================================================
  //   console.log("signedIn: " + signedIn);

  console.log("started: " + started);
  //   console.log("gameOver: " + gameOver);
  console.log("settingsOpen: " + settingsOpen);
  console.log("timer: " + timer);
  console.log("gameReady: " + gameReady);
  //   console.log("settingsOpen" + settingsOpen);

  ///// ====================   WENT OVER NO-COST LIMIT ===========================================

  //   const getHighScore = async () => {
  //     try {
  //       const data = await getDocs(userDataRef);
  //       const filteredData = data.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }));
  //       const currentUserData = filteredData.filter(
  //         (obj) => obj.user === auth?.currentUser?.uid
  //       );
  //       const scores = currentUserData.map((item) => item["wordsPerMinute"]);
  //       const highScore = Math.max(...scores);
  //       setHighScore(highScore);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getHighScore();
  // ///// =============================================================================

  return (
    <div>
      <div className="App">
        {gameOver ? (
          <GameOver
            typedWords={typedWords}
            allIncorrect={allIncorrect}
            /*highScore={highScore}*/
          />
        ) : null}
        {settingsOpen ? <Settings /> : null}
        {accountModalOpen ? <Account /*highScore={highScore}*/ /> : null}

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
            <div>Words Typed: {typedWords}</div>
            <div>
              Average Words/minute:{" "}
              {!gameOver
                ? calculateWordsPerMinute()
                : Math.floor((typedWords / timer) * 60)}
            </div>
          </div>
          <div id="display">
            <span id="matching">{matching}</span>
            <span id="wrong">{wrongKey}</span>
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
