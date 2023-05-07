import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../AppContext";
import { Auth } from "./auth";

const GameOver = (props) => {
  const { closeGameOver, gameOver } = useContext(AppContext);

  const { typedWords, totalTime, highScore } = props;
  const wordsPerMinuteFinal = Math.floor((typedWords / totalTime) * 60);

  // DATABASE

  //   const userDataRef = collection(db, "userData");
  //   useEffect(() => {

  //   const submitScore = async () => {
  //     try {
  //       await addDoc(userDataRef, {
  //         user: auth?.currentUser?.uid,
  //         wordsPerMinute: wordsPerMinuteFinal,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

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
          height: "40%",
          width: "40%",
          borderRadius: "20px",
          boxShadow: "10",
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
        High Score: {highScore}
        <br />{" "}
        <button style={{ position: "absolute", bottom: 15, height: "30px" }}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
