export default function ThirdStep({
  title,
  description,
  moneyGoal,
  date,
  time,
  img,
  setCurrentStep,
}: any) {
  return (
    <div className={`titleFormCover`}>
      <div className="eventConfirm">
        <h1>{`Title: ${title}`}</h1>
        <h1>{`Selected Img: ${img}`}</h1>
        <h1>{`Description: ${description}`}</h1>
        <h1>{`Money Goal: ${moneyGoal}`}</h1>
        <h1>{`Deadline Date: ${date}`}</h1>
        <h1>{`Deadline Time: ${time}`}</h1>
      </div>
      <div className="nextPrevButtonWrap">
        <button
          onClick={() => {
            setCurrentStep("secondStep");
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setCurrentStep("complete");
          }}
        >
          Confirm?
        </button>
      </div>
    </div>
  );
}
