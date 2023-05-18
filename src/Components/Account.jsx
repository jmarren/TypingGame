import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../AppContext";
import { auth, googleProvider } from "../config/firebase";
import Auth from "./Auth";

const Account = (/*props*/) => {
  //   const { highScore } = props;
  const { closeAccountModal } = useContext(AppContext);
  console.log(auth?.currentUser?.uid);
  return (
    <div>
      <div
        style={{
          color: "white",
          fontFamily: "Tahoma",
          fontSize: "30px",
          zIndex: "100",
          backgroundColor: "#4287f5",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          verticalAlign: "top",
          top: "10%",
          padding: "60px 60px 0",
          left: "30%",
          height: "60%",
          width: "40%",
          borderRadius: "20px",
          border: "5px solid #8bccd6",
          //   backgroundClip: "content-box", (Show padding)
          boxSizing: "border-box",
          boxShadow: "0px 0px 100px rgba(0, 0, 0, .7)",
        }}
      >
        <div>
          <Auth /> <br />
          High Score: {/*highScore*/}
        </div>

        <button
          onClick={closeAccountModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Account;
