import { useEffect, useState } from "react";
import FirstStep from "./firstStep";
import SecondStep from "./secondStep";
import ThirdStep from "./thirdStep";
import EventMade from "./eventMade";
import { useAuth } from "../../hooks/authContext";

export default function CreateEventPop({
  activeStep,
  setActiveStep,
  onClose,
}: any) {
  const [title, setTitle] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [img, setImg] = useState<string>("default");
  const [description, setDescriptionValue] = useState<string>("");

  const [moneyGoal, setMoneyGoal] = useState<string>("Budget-friendly");
  const [moneyVal, setMoneyVal] = useState<string>("$10");
  const [date, setDate] = useState();

  const [showEventComplete, setShowEventComplete] = useState<boolean>(false);

  const [loadingEvent, setLoadingEvent] = useState<boolean>(false);

  const { setRefreshEvent } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoadingEvent(true);
        if (showEventComplete) {
          const data = JSON.stringify({
            title,
            description,
            img,
            moneyGoal: moneyVal,
            date,
          });

          await fetch("/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          });
          setRefreshEvent(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEventComplete]);

  return (
    <div>
      {activeStep === 0 && (
        <FirstStep
          currentValue={setTitle}
          theValue={title}
          descriptionValue={description}
          setDescriptionValue={setDescriptionValue}
          setActiveStep={setActiveStep}
        />
      )}

      {activeStep === 1 && (
        <SecondStep
          setMoneyGoal={setMoneyGoal}
          moneyGoal={moneyGoal}
          setDate={setDate}
          date={date}
          setActiveStep={setActiveStep}
          moneyVal={moneyVal}
          setMoneyVal={setMoneyVal}
        />
      )}

      {activeStep === 2 && (
        <ThirdStep
          title={title}
          description={description}
          moneyGoal={moneyGoal}
          date={date}
          setActiveStep={setActiveStep}
          setShowEventComplete={setShowEventComplete}
          img={img}
          moneyVal={moneyVal}
        />
      )}

      {showEventComplete && (
        <EventMade
          title={title}
          description={description}
          moneyGoal={moneyGoal}
          date={date}
          img={img}
          loading={loadingEvent}
          setLoading={setLoadingEvent}
          onClose={onClose}
        />
      )}
    </div>
  );
}
