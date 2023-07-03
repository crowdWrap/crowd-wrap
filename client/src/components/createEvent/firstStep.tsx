import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Form } from "react-router-dom";
import FileUpload from "../setUsername/fileUpload";

export default function FirstStep({
  currentValue,
  theValue,
  descriptionValue,
  setDescriptionValue,
  setActiveStep,
}: any) {
  const handleButtonClick = (event: any) => {
    event.preventDefault();
    if (theValue.length > 3 && theValue.length < 21) {
      setActiveStep(1);
    }
  };

  const [titleError, setTitleError] = useState<string>("");
  const [titleTouched, setTitleTouched] = useState<boolean>(false);
  const [picture, setPicture] = useState(
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"
  );

  const validateTitle = (username: string) => {
    if (theValue.length < 4 || theValue.length > 21) {
      setTitleError("Title must be between 4 and 20 characters");
    } else {
      setTitleError("");
    }
  };

  return (
    <Form onSubmit={(event) => handleButtonClick(event)}>
      <Flex
        height="400px"
        justifyContent="space-between"
        flexDir="column"
        alignItems="center"
      >
        <Button
          border="1px solid black"
          borderRadius="full"
          width="125px"
          height="125px"
          padding="0"
        >
          <FileUpload thePicture={picture} />
        </Button>
        <FormControl
          variant="floating"
          id="title"
          isRequired
          isInvalid={titleError === "" ? false : true}
        >
          <Input
            placeholder=" "
            minLength={4}
            maxLength={20}
            value={theValue}
            onChange={(e: any) => currentValue(e.target.value)}
            onBlur={() => {
              validateTitle(theValue);
            }}
          />
          <FormLabel>Title</FormLabel>
          {titleError !== "" && (
            <>
              <FormErrorMessage>{titleError}</FormErrorMessage>
            </>
          )}
        </FormControl>
        <FormControl variant="floating" id="description">
          <Textarea
            placeholder=" "
            name="description"
            maxLength={132}
            value={descriptionValue}
            resize="none"
            onChange={(e: any) => setDescriptionValue(e.target.value)}
          />
          <FormLabel>
            Description <span style={{ color: "grey" }}>(Optional)</span>
          </FormLabel>
        </FormControl>
        <Button type="submit">Next</Button>
      </Flex>
    </Form>
  );
}
