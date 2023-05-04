import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../AppContext";

const GameOver = (props) => {
  const { closeGameOver } = useContext(AppContext);

  const { typedWords } = props;

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
        Words/Minute: {typedWords} <br />
        Total Words: {typedWords}
        <br />{" "}
        <button style={{ position: "absolute", bottom: 15, height: "30px" }}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
