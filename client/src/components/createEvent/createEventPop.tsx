import { useState } from "react";
import FirstStep from "./firstStep";

export default function CreateEventPop() {
  const [currentStep, setCurrentStep] = useState<string>("firstStep");
  const [title, setTitle] = useState<string>("");

  return (
    <div className="createEventForm">
      <div className="steps">
        <div className="step" onClick={() => setCurrentStep("firstStep")}>
          {/* first have them choose title and image and description(optional) */}
          <h1>1</h1>
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
        <div className="step" onClick={() => setCurrentStep("secondStep")}>
          {/* choose money goal, deadline, and some gift examples(optional) */}
          <h1>2</h1>
        </div>
        <div className="step" onClick={() => setCurrentStep("thirdStep")}>
          {/* provide invite link, and ask them if they want to invite any of their friends */}
          <h1>3</h1>
        </div>
      </div>

      {currentStep === "firstStep" && (
        <FirstStep
          currentValue={(value: any) => setTitle(value)}
          theValue={title}
          setCurrentStep={(value: any) => setCurrentStep(value)}
        />
      )}
    </div>
  );
}
