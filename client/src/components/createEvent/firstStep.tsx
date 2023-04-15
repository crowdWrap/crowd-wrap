import { useState } from "react";

export default function FirstStep({
  currentValue,
  theValue,
  setCurrentStep,
}: any) {
  const handleButtonClick = (event: any) => {
    // event.preventDefault();
    // if()
    // setCurrentStep("secondStep");
  };
  return (
    <div className="titleFormCover">
      <img
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"
        alt="a pink gift with white ribbons"
      />
      <div className="titleCover">
        <input
          name="titleInput"
          type="text"
          maxLength={12}
          required
          onChange={(e: any) => currentValue(e.target.value)}
          value={theValue}
        />
        <label htmlFor="titleInput">
          Title<span style={{ color: "red" }}>*</span>
        </label>
      </div>
      <textarea name="description" id="eventDescription"></textarea>
      <button
        type="submit"
        onClick={(event) => {
          handleButtonClick(event);
        }}
      ></button>
    </div>
  );
}
