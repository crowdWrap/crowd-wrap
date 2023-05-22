import { useEffect, useState } from "react";
import FirstStep from "./firstStep";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import SecondStep from "./secondStep";
import ThirdStep from "./thirdStep";
import EventMade from "./eventMade";

export default function CreateEventPop({ setRefresh }: any) {
  const [currentStep, setCurrentStep] = useState<string>("firstStep");
  const [title, setTitle] = useState<string>("");
  const [img, setImg] = useState<string>("default");
  const [description, setDescriptionValue] = useState<string>("");

  const [selectedButton, setSelectedButton] = useState<string>("");
  const [moneyGoal, setMoneyGoal] = useState<string>("");
  const [time, setTime] = useState();
  const [date, setDate] = useState();

  const [showFirstStep, setShowFirstStep] = useState<boolean>(true);
  const [showSecondStep, setShowSecondStep] = useState<boolean>(false);
  const [showThirdStep, setShowThirdStep] = useState<boolean>(false);
  const [showEventComplete, setShowEventComplete] = useState<boolean>(false);

  const [loadingEvent, setLoadingEvent] = useState<boolean>(false);

  // check before they select a button that the input is valid

  useEffect(() => {
    setShowFirstStep(currentStep === "firstStep");
    setShowSecondStep(currentStep === "secondStep");
    setShowThirdStep(currentStep === "thirdStep");
    setShowEventComplete(currentStep === "complete");
  }, [currentStep]);

  useEffect(() => {
    (async () => {
      try {
        if (showEventComplete) {
          const data = JSON.stringify({
            title,
            description,
            img,
            moneyGoal,
            time,
            date,
          });

          fetch("/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          });
          setRefresh(true);
          setLoadingEvent(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEventComplete]);

  return (
    <div className="createEventForm">
      <div className="steps">
        <div
          className={
            currentStep === "secondStep" ||
            currentStep === "thirdStep" ||
            showEventComplete
              ? "step stepActive"
              : "step"
          }
          onClick={() => {
            if (!showEventComplete) setCurrentStep("firstStep");
          }}
        >
          {/* first have them choose title and image and description(optional) */}
          <h1
            className={
              currentStep === "secondStep" ||
              currentStep === "thirdStep" ||
              showEventComplete
                ? "removeStepCounter"
                : ""
            }
          >
            1
          </h1>
          <FontAwesomeIcon
            className={
              currentStep === "secondStep" ||
              showEventComplete ||
              currentStep === "thirdStep"
                ? "stepCheck stepCheckShow"
                : "stepCheck"
            }
            icon={faCheck}
            size="xl"
          />
          <div className="stepLine">
            <div
              className={
                currentStep === "secondStep"
                  ? "theStepLine stepHalf"
                  : currentStep === "thirdStep"
                  ? "theStepLine stepFinished"
                  : "theStepLine"
              }
            ></div>
          </div>
        </div>
        <div
          className={
            currentStep === "thirdStep" || showEventComplete
              ? "step stepActive"
              : "step"
          }
          onClick={() => {
            if (title.length >= 3 && !showEventComplete) {
              setCurrentStep("secondStep");
            }
          }}
        >
          {/* choose money goal, deadline, and some gift examples(optional) */}
          <h1
            className={
              currentStep === "thirdStep" || showEventComplete
                ? "removeStepCounter"
                : ""
            }
          >
            2
          </h1>
          <FontAwesomeIcon
            className={
              currentStep === "thirdStep" || showEventComplete
                ? "stepCheck stepCheckShow"
                : "stepCheck"
            }
            icon={faCheck}
            size="xl"
          />
        </div>
        <div
          className={showEventComplete ? "step stepActive" : "step"}
          onClick={() => {
            if (title.length >= 3 && selectedButton && !showEventComplete) {
              setCurrentStep("thirdStep");
            }
          }}
        >
          {/* provide invite link, and ask them if they want to invite any of their friends */}
          <h1 className={showEventComplete ? "removeStepCounter" : ""}>3</h1>
          <FontAwesomeIcon
            className={
              showEventComplete ? "stepCheck stepCheckShow" : "stepCheck"
            }
            icon={faCheck}
            size="xl"
          />
        </div>
      </div>

      {showFirstStep && !showEventComplete && (
        <FirstStep
          currentValue={(value: any) => setTitle(value)}
          theValue={title}
          setCurrentStep={(value: any) => setCurrentStep(value)}
          currentClass={currentStep !== "firstStep" ? "removeCurrentForm" : ""}
          descriptionValue={description}
          setDescriptionValue={(value: any) => setDescriptionValue(value)}
        />
      )}

      {showSecondStep && !showEventComplete && (
        <SecondStep
          setCurrentStep={(value: any) => setCurrentStep(value)}
          setMoneyGoal={(value: any) => setMoneyGoal(value)}
          setSelectedButton={(value: any) => setSelectedButton(value)}
          selectedButton={selectedButton}
          moneyGoal={moneyGoal}
          setTime={(value: any) => setTime(value)}
          setDate={(value: any) => setDate(value)}
          time={time}
          date={date}
        />
      )}

      {showThirdStep && !showEventComplete && (
        <ThirdStep
          title={title}
          description={description}
          moneyGoal={moneyGoal}
          date={date}
          time={time}
          img={img}
          setCurrentStep={(value: any) => setCurrentStep(value)}
        />
      )}

      {showEventComplete && (
        <EventMade
          title={title}
          description={description}
          moneyGoal={moneyGoal}
          date={date}
          time={time}
          img={img}
          loading={loadingEvent}
          setLoading={(val: boolean) => setLoadingEvent(val)}
        />
      )}
    </div>
  );
}
