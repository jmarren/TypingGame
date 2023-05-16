import React, { useEffect, useState, useContext, useMemo } from "react";
import "../App.css";
import { AppContext } from "../../AppContext";
import GameOver from "./GameOver";
import Settings from "./Settings";
import randomWords from "random-words";
import Account from "./Account";
import { auth } from "../config/firebase";
// import { db } from "../config/firebase";
// import { getDocs, collection, addDoc, doc } from "firebase/firestore";

const MainConsole = () => {
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
  const TOTALTIME = 20;

  /////////////////////////////////  STATE  /////////////////////////////////////////
  const [currentWord, setCurrentWord] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [words, setWords] = useState(randomWords({ exactly: 100 }));
  const [matching, setMatching] = useState("");
  //const [highScore, setHighScore] =                                    useState(0);
  const [wrongKey, setWrongKey] = useState("");
  const [isActive, setIsActive] = useState(KEYACTIVE);
  const [buttonColor, setBackgroundColor] = useState(KEYCOLORS);
  const [letterIndex, setLetterIndex] = useState(0);
  const [timer, setTimer] = useState(TOTALTIME);
  const [started, setStarted] = useState(false);
  const [typedWords, setTypedWords] = useState(-1);

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
    gameStart,
  } = useContext(AppContext);

  //   useEffect(() => {
  //     setCurrentWord(words[0]);
  //   }, [words]);

  //////////////////////////////////// FUNCTIONS //////////////////////////////////

  const NextWord = () => {
    setWordIndex((prevIndex) => prevIndex + 1);
    setCurrentWord(() => words[0]);
    setMatching(() => "");
  };

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

  const checkInput = (keyPressed) => {
    if (!gameOver) {
      if (wrongKey == "") {
        if (keyPressed === currentWord[0]) {
          setCurrentWord(currentWord.slice(1));
          setMatching((prevMatching) => prevMatching + keyPressed);
        } else if (keyboardKeys.includes(keyPressed.toUpperCase())) {
          setWrongKey((prevWrong) => prevWrong + keyPressed);
        }
      }

      if (wrongKey !== "") {
        if (keyPressed === "Backspace") {
          setWrongKey((prevWrong) => prevWrong.slice(0, -1));
        } else if (keyboardKeys.includes(keyPressed.toUpperCase())) {
          setWrongKey((prevWrong) => prevWrong + keyPressed);
        }
      }
    }
  };

  if (timer === 0) {
    openGameOver();
    setStarted(false);
    setTimer(20);
    //   submitScore();
  }

  const handleKeyPress = (event) => {
    if (!started && !gameOver) {
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

  const StartGame = () => {
    if (gameStart) {
      setTimer(TOTALTIME);
      setTypedWords(0);
      setCurrentWord((prevWord) => words[wordIndex + 1]);
      setMatching((prevMatching) => "");
      setWrongKey((prevWrong) => "");
    }
  };

  const calculateWordsPerMinute = () => {
    // Calculate words per minute based on the typed words and the timer value
    if (!started) {
      return 0;
    }
    const wordsPerMinute = Math.floor((typedWords / (20 - timer)) * 60);
    return wordsPerMinute;
  };

  //////////////////////////////////////  EFFECTS  ///////////////////////////////////

  useEffect(() => {
    NextWord();
  }, [words, gameStart]);

  useEffect(() => {
    changeWordsArray();
  }, [checkboxValues]);

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

  useEffect(() => {
    // Add an event listener for the 'keydown' event when the component mounts
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp); // Fixed here
    };
  }, [currentWord, wrongKey]);

  useEffect(() => {
    let intervalId;
    // Start the timer when the game is started
    if (started && !gameOver) {
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

  const wordsPerMinuteFinal = Math.floor((typedWords / TOTALTIME) * 60);

  useEffect(() => {
    StartGame();
  }, [gameStart]);
  //const userDataRef = collection(db, "userData");

  ///// ====================   WENT OVER NO-COST LIMIT ===========================================
  //   const submitScore = async () => {
  //     try {
  //       await addDoc(userDataRef, {
  //         user: auth?.currentUser?.uid,
  //         wordsPerMinute: wordsPerMinuteFinal,
  //       });
  //       console.log("submitted");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

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

  //   useEffect(() => {
  //     EndGame();
  //   }, [timer]);

  /// ==========================

  console.log(wrongKey);
  console.log(matching);

  return (
    <div>
      <div className="App">
        {gameOver ? (
          <GameOver
            typedWords={typedWords}
            TOTALTIME={TOTALTIME}
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
