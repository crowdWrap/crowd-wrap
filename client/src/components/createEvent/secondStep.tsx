import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function SecondStep({
  setCurrentStep,
  setMoneyGoal,
  setSelectedButton,
  selectedButton,
  moneyGoal,
  setTime,
  setDate,
  time,
  date,
}: any) {
  const [currentButton, setCurrentButton] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (currentButton) {
      setSelectedButton(currentButton);
    }
  }, [currentButton]);

  // ${currentClass}
  return (
    <div className={`titleFormCover`}>
      <div className="moneyGoalCover">
        <label htmlFor="">money goal*</label>
        <button
          onClick={() => {
            setCurrentButton("first");
            setGoal("$5-$20");
            setMoneyGoal("$5-$20");
          }}
          id={selectedButton === "first" ? "moneyGoalActive" : ""}
        >
          On a budget <br /> $5-$20
        </button>
        <button
          onClick={() => {
            setCurrentButton("second");
            setGoal("$25-$50");
            setMoneyGoal("$25-$50");
          }}
          id={selectedButton === "second" ? "moneyGoalActive" : ""}
        >
          Affordable <br /> $25-$50
        </button>
        <button
          onClick={() => {
            setCurrentButton("third");
            setGoal("$100+");
            setMoneyGoal("$100+");
          }}
          id={selectedButton === "third" ? "moneyGoalActive" : ""}
        >
          Boujee <br /> $100+
        </button>
        <button
          onClick={() => setCurrentButton("fourth")}
          id={selectedButton === "fourth" ? "moneyGoalActive" : ""}
        >
          Custom
          <input
            type="text"
            onChange={(e) => {
              if (selectedButton === "fourth") {
                setGoal(e.target.value);
                setMoneyGoal(e.target.value);
              }
            }}
            value={selectedButton === "fourth" ? moneyGoal : ""}
          />
        </button>
      </div>

      <div className="deadlineGiftCover">
        <div className="deadlineCover">
          <label htmlFor="">deadline</label>
          <input
            onChange={(e) => setTime(e.target.value)}
            type="time"
            name=""
            id=""
            value={time}
          />
          <input
            onChange={(e) => setDate(e.target.value)}
            type="date"
            name=""
            id=""
            value={date}
            //make sure date is not before current date
          />
        </div>
      </div>
      <div className="nextPrevButtonWrap">
        <button
          onClick={() => {
            setCurrentStep("firstStep");
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setCurrentStep("thirdStep");
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
