import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FirstStep({
  currentValue,
  theValue,
  setCurrentStep,
  currentClass,
  descriptionValue,
  setDescriptionValue,
}: any) {
  const handleButtonClick = () => {
    // event.preventDefault();
    if (theValue.length >= 3) {
      setCurrentStep("secondStep");
    }
    // event.target.checkValidity();
  };

  return (
    <div className={`titleFormCover ${currentClass}`}>
      <div className="imageAndTitleCover">
        <div className="titleImgCover">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"
            alt="a pink gift with white ribbons"
          />
          <FontAwesomeIcon icon={faUpload} size="2xl" />
        </div>
        <div className="titleCover">
          <input
            name="titleInput"
            type="text"
            minLength={3}
            placeholder=" "
            maxLength={18}
            required
            onChange={(e: any) => currentValue(e.target.value)}
            value={theValue}
          />
          <label htmlFor="titleInput">
            Title<span style={{ color: "red" }}>*</span>
          </label>
        </div>
      </div>
      <div className="descriptionCover">
        <label htmlFor="description">Description(optional):</label>
        <textarea
          name="description"
          maxLength={132}
          id="eventDescription"
          onChange={(e: any) => setDescriptionValue(e.target.value)}
          value={descriptionValue}
        ></textarea>
      </div>
      <button
        onClick={() => {
          handleButtonClick();
        }}
      >
        Next
      </button>
    </div>
  );
}
