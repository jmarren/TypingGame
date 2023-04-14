import './App.css'
import React, { useEffect, useState } from 'react';
import GameOver from './GameOver';




function App() {

  const words = ['hi blake', 'look', 'at', 'this', 'game', 'I made', 'to learn', 'how', 'to type!', ':)']
  // const words = ['hi jake', 'true', 'vent', 'believe', 'and', 'sauce', 'anywhere', 'the', 'website', 'openings', 'shopping', 'experience', 'zebra']
  const [wordIndex, setWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState(words[wordIndex])
  const [currentLetter, setCurrentLetter] = useState(currentWord[0])
  const [letterIndex, setLetterIndex] = useState(0)
  const [matching, setMatching] = useState('')
  const [timer, setTimer] = useState(60); // Timer starting value
  const [started, setStarted] = useState(false); // Flag to indicate if the game has started
  const [typedWords, setTypedWords] = useState(0)
  const [gameOver, setGameOver] = useState(false);




  // KEYBOARD
  const keyColors = {}
  const keyActive = {}
  const keyboardKeys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
  ];

  for (const key of keyboardKeys) {
    keyColors[key] = 'blue'
    keyActive[key] = false
  }

  const [isActive, setIsActive] = useState(keyActive)
  const [buttonColor, setBackgroundColor] = useState(keyColors)
  /////




  useEffect(() => {


    const handleKeyPress = (event) => {
      if (!started) {
        setStarted(true)
      }

      // Check if the pressed key matches the first letter of the word
      if (event.key === currentWord[0]) {
        setCurrentWord(currentWord.slice(1));
        setMatching(prevMatching => prevMatching + event.key)
      }

      /// Key Color Change
      for (let i = 0; i < keyboardKeys.length; i++) {
        const item = keyboardKeys[i].toLowerCase()

        switch (item) {
          case event.key:
            setBackgroundColor(prevColors => {
              const newKeyColors = { ...prevColors };
              newKeyColors[item.toUpperCase()] = 'red'
              return newKeyColors;
            })
            break;
        }
      }

    };
    const handlekeyUp = (event) => {
      // Key Color Change
      for (let i = 0; i < keyboardKeys.length; i++) {
        const item = keyboardKeys[i].toLowerCase()
        switch (item) {
          case event.key:
            setBackgroundColor(prevColors => {
              const newKeyColors = { ...prevColors };
              newKeyColors[item.toUpperCase()] = 'blue';
              return newKeyColors;
            })
            break;
        }
      }
    }
    if (currentWord === '') {
      setCurrentWord(prevWord => words[wordIndex + 1])
      setWordIndex(prevIndex => prevIndex + 1)
      setMatching(prevMatching => '')
      setTypedWords(prevTyped => prevTyped + 1)
    }



    // Add an event listener for the 'keydown' event when the component mounts
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handlekeyUp);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handlekeyUp); // Fixed here
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
    const wordsPerMinute = Math.floor((typedWords / (60 - timer)) * 60);
    return wordsPerMinute;
  };

  useEffect(() => {
    if (timer === 55) {
      setGameOver(true)
    }
  }, [timer])



  return (
    <div>{gameOver ? (<GameOver />) :
      (<div className="App">
        <div className='centered'>
          <h1 id='title'>Typist Dojo</h1>
        </div>
        <div id='console'>
          <div id='stats'><div>Time Remaining: {timer}</div><div>Average Words/minute: {calculateWordsPerMinute()}</div></div>
          <div id='display'><span id='matching'>{matching}</span><span>{currentWord}</span></div>
          <div className="keyboard">
            {keyboardKeys.map(key => (
              <div className={isActive[key] == true ? 'key active' : 'key'} id={key} key={key} style={{ backgroundColor: buttonColor[key] }}>
                {key}
              </div>
            ))}
          </div>
        </div>
      </div >)}</div>
  )

}


export default App

