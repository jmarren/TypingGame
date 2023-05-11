import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../AppContext";

function Settings() {
  const { closeSettings, setCheckboxValues, checkboxValues } =
    useContext(AppContext);

  const [letterCheckboxesDisabled, setLetterCheckboxesDisabled] =
    useState(false);

  const [randomWordsChecked, setRandomWordsChecked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const checkboxes = event.target.querySelectorAll('input[type="checkbox"]');
    const checkedValues = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedValues.push(checkbox.value);
      }
    });
    setCheckboxValues(checkedValues);
  };

  console.log(checkboxValues);

  const handleLetterCheckboxChange = (event) => {
    const randomWordsCheckbox = event.target.form.randomWords;
    if (randomWordsCheckbox.checked) {
      randomWordsCheckbox.checked = false;
      setRandomWordsChecked(false);
    }
  };

  const handleRandomWordsCheckboxChange = (event) => {
    const letterCheckboxes = event.target.form.querySelectorAll(
      'input[class="letters"]'
    );
    if (event.target.checked) {
      letterCheckboxes.checked = false;
      letterCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
        checkbox.checked = false;
      });
    } else {
      setLetterCheckboxesDisabled(false);
      letterCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
      });
    }
  };

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

  return (
    <div>
      <div
        style={{
          fontSize: "50px",
          fontFamily: "Tahoma",
          color: "white",
          zIndex: "100",
          backgroundColor: "#4287f5",
          justifyContent: "center",
          verticalAlign: "top",
          paddingTop: "0px",
          position: "fixed",
          top: "10%",
          left: "30%",
          height: "80%",
          width: "40%",
          borderRadius: "20px",
          border: "5px solid #8bccd6",
          boxSizing: "border-box",
          boxShadow: "0px 0px 100px rgba(0, 0, 0, .7)",
        }}
      >
        <div
          id="settings-title"
          style={{
            fontFamily: "Tahoma",
            position: "relative",
            top: "0",
            width: "100%",
            textAlign: "center",
            // border: "2px solid black",
            height: "10%",
            boxSizing: "border-box",
          }}
        >
          Settings
        </div>

        <button
          onClick={closeSettings}
          style={{
            fontSize: "1rem",
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "200",
          }}
        >
          X
        </button>

        <h1
          style={{
            fontSize: ".5em",
            // border: "2px solid black",
            position: "relative",
            top: "0",
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          Letters
        </h1>

        <div
          style={{
            boxSizing: "border-box",
            // border: "2px solid black",
            height: "20%",
            width: "100%",
            position: "absolute",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              //   border: "2px solid black",
              boxSizing: "border-box",
              height: "100%",
              padding: 0,
              zIndex: "500",
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {keyboardKeys.map((key) => (
              <label
                htmlFor={key}
                style={{
                  fontSize: ".3em",
                  width: "10px",
                  margin: "5px",
                  position: "relative",
                  top: "0px",
                }}
                key={key}
              >
                <input
                  type="checkbox"
                  className="letters"
                  value={key}
                  name={key}
                  onChange={handleLetterCheckboxChange}
                  disabled={randomWordsChecked}
                  //   checked={checkBoxValues[key] || false}
                  //   onChange={handleCheckBoxChange}
                />
                {key}
              </label>
            ))}

            {/* </div> */}

            <label style={{ fontSize: ".3em" }}>
              <input
                type="checkbox"
                value="randomWords"
                name="randomWords"
                onChange={handleRandomWordsCheckboxChange}
                disabled={letterCheckboxesDisabled}
              />{" "}
              Random Words{" "}
            </label>

            <button
              type="submit"
              style={{
                bottom: "-10px",
                width: "10%",
                left: "55%",
                marginLeft: "20px",
                height: "20px",
                verticalAlign: "center",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
