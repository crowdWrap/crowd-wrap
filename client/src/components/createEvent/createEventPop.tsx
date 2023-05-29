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
  const [img, setImg] = useState<string>("default");
  const [description, setDescriptionValue] = useState<string>("");

  const [moneyGoal, setMoneyGoal] = useState<string>("Budget-friendly");
  const [date, setDate] = useState();

  const [showEventComplete, setShowEventComplete] = useState<boolean>(false);

  const [loadingEvent, setLoadingEvent] = useState<boolean>(false);

  const { setRefreshEvent } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        if (showEventComplete) {
          const data = JSON.stringify({
            title,
            description,
            img,
            moneyGoal,
            date,
          });

          fetch("/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: data,
          });
          setRefreshEvent(true);
          setLoadingEvent(true);
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
          currentValue={(value: any) => setTitle(value)}
          theValue={title}
          descriptionValue={description}
          setDescriptionValue={(value: any) => setDescriptionValue(value)}
          setActiveStep={(val: number) => setActiveStep(val)}
        />
      )}

      {activeStep === 1 && (
        <SecondStep
          setMoneyGoal={(value: any) => setMoneyGoal(value)}
          moneyGoal={moneyGoal}
          setDate={(value: any) => setDate(value)}
          date={date}
          setActiveStep={(val: number) => setActiveStep(val)}
        />
      )}

      {activeStep === 2 && (
        <ThirdStep
          title={title}
          description={description}
          moneyGoal={moneyGoal}
          date={date}
          setActiveStep={(val: number) => setActiveStep(val)}
          setShowEventComplete={(val: boolean) => setShowEventComplete(val)}
          img={img}
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
          setLoading={(val: boolean) => setLoadingEvent(val)}
          onClose={onClose}
        />
      )}
    </div>
  );
}
