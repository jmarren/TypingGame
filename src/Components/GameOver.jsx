import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../AppContext";
import { Auth } from "./Auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc, doc } from "firebase/firestore";
const userDataRef = collection(db, "userData");

const GameOver = (props) => {
  const { closeGameOver, gameOver, signedIn, totalTime } =
    useContext(AppContext);

  const { typedWords, allIncorrect /*highScore */ } = props;
  const wordsPerMinuteFinal = Math.floor((typedWords / totalTime) * 60);

  const totalMistakes = allIncorrect.length;

  const currentDate = new Date();
  const dateObject = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: currentDate.getDate(),
    hour: currentDate.getHours(),
    minute: currentDate.getMinutes(),
    second: currentDate.getSeconds(),
  };
  // DATABASE

  const submitScore = async () => {
    console.log("submit ran");

    try {
      await addDoc(userDataRef, {
        user: auth?.currentUser?.uid,
        wordsPerMinute: wordsPerMinuteFinal,
        date: dateObject,
      });
      console.log("submitted");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (signedIn) {
      submitScore();
    }
  }, []);

  // const userDataRef = collection(db, "userData");
  // useEffect(() => {

  // const submitScore = async () => {
  //   try {
  //     await addDoc(userDataRef, {
  //       user: auth?.currentUser?.uid,
  //       wordsPerMinute: wordsPerMinuteFinal,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //   console.log("ran");

  //   useEffect(() => {
  //     submitScore();
  //     console.log("submitted");
  //   }, [gameOver]);

  //   }, []);

  //   const highScore = async () => {
  //     await getHighScore();
  //   };

  return (
    <div>
      <div
        style={{
          fontSize: "50px",
          zIndex: "100",
          backgroundColor: "#738fc7",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: "25%",
          left: "30%",
          height: "50%",
          width: "40%",
          borderRadius: "20px",
          boxShadow: "0px 0px 100px rgba(0, 0, 0, .7)",
          border: "10px solid white",
        }}
      >
        <button
          onClick={closeGameOver}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          X
        </button>
        Game Over!
        <br />
        Words/Minute: {wordsPerMinuteFinal} <br />
        Total Words: {typedWords} <br />
        Total Mistakes: {totalMistakes} <br />
        High Score: {/*{highScore}*/}
        <br />{" "}
        <button style={{ position: "absolute", bottom: 15, height: "30px" }}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
