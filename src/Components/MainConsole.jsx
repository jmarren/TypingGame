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
  //STATE
  const [currentWord, setCurrentWord] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [words, setWords] = useState(randomWords({ exactly: 100 }));
  const [matching, setMatching] = useState("");
  //const [highScore, setHighScore] = useState(0);
  const [wrongKey, setWrongKey] = useState("");
  const [isActive, setIsActive] = useState(keyActive);
  const [buttonColor, setBackgroundColor] = useState(keyColors);
  const [letterIndex, setLetterIndex] = useState(0);

  const [timer, setTimer] = useState(TOTALTIME); // Timer starting value
  const [started, setStarted] = useState(false); // Flag to indicate if the game has started
  const [typedWords, setTypedWords] = useState(-1);
  const TOTALTIME = 20;

  // CONTEXT
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

  useEffect(() => {
    if (
      checkboxValues[0] === "randomWords" ||
      checkboxValues[-1] === "randomWords"
    ) {
      setWords(randomWords({ exactly: 100 }));
    } else {
      setWords(generateStrings(checkboxValues));
    }
  }, [checkboxValues]);

  useEffect(() => {
    setWordIndex((prevIndex) => prevIndex + 1);
    setCurrentWord(() => words[0]);
    setMatching(() => "");
  }, [words, gameStart]);

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

  // GENERATE STRINGS FUNCTION
  const generateStrings = (letters) => {
    const strings = [];

    console.log("strings function ran");
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
  };

  //////

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

  /////

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!started && !gameOver) {
        setStarted(true);
      }

      const keyPressed = event.key;

      const checkInput = () => {
        // Check if the pressed key matches the first letter of the word

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

        // } else if (keyPressed === "Backspace") {
        //   setWrongKey((prevWrong) => prevWrong.slice(0, -1));
        // }
      };

      //     if (event.key === currentWord[0] && wrongKey == "") {
      //       setCurrentWord(currentWord.slice(1));
      //       setMatching((prevMatching) => prevMatching + event.key);
      //     }

      //     if (event.key === "Backspace" && wrongKey !== "") {
      //       setWrongKey((prevWrong) => prevWrong.slice(0, -1));
      //     }

      //     if (
      //       keyboardKeys.includes(event.key.toUpperCase()) &&
      //       event.key !== currentWord[0]
      //     ) {
      //       setWrongKey((prevWrong) => prevWrong + event.key);
      //     }
      //   };

      checkInput();

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

  const wordsPerMinuteFinal = Math.floor((typedWords / TOTALTIME) * 60);

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
  useEffect(() => {
    if (timer === -1000000) {
      openGameOver();
      setStarted(false);
      setTimer(20);
      //   submitScore();
    }
  }, [timer]);

  useEffect(() => {
    if (gameStart) {
      setTimer(TOTALTIME);
      setTypedWords(0);
      setCurrentWord((prevWord) => words[wordIndex + 1]);
      setMatching((prevMatching) => "");
      setWrongKey((prevWrong) => "");
    }
  }, [gameStart]);

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
                : Math.floor((typedWords / TOTALTIME) * 60)}
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
