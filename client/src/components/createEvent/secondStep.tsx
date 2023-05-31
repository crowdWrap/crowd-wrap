import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";

function NumericInput({ setMoneyVal, ...props }: any) {
  const handleInputChange = (event: any) => {
    event.target.value = `$${event.target.value.replace(/[^0-9]/g, "")}`;
    setMoneyVal(event.target.value);
  };

  return <EditableInput {...props} onInput={handleInputChange} />;
}

function RadioCard({ setMoneyVal, ...props }: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        height="75px"
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blue.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
        {props.subtext !== "" ? (
          <Text color="blackAlpha.500">{props.subtext}</Text>
        ) : (
          <Editable color="blackAlpha.500" defaultValue="Enter value">
            <EditablePreview />
            <NumericInput
              setMoneyVal={setMoneyVal}
              maxLength={5}
              width="82.5px"
            />
          </Editable>
        )}
      </Box>
    </Box>
  );
}

export default function SecondStep({
  setMoneyGoal,
  moneyGoal,
  setDate,
  date,
  setActiveStep,
  moneyVal,
  setMoneyVal,
}: any) {
  const options = [
    { title: "Budget-friendly", option: "$5-$20" },
    { title: "Mid-Range", option: "$21-$50" },
    { title: "Top-Tier", option: "$51+" },
    { title: "Custom", option: "" },
  ];

  const handleChange = (val: string) => {
    const value = options.filter((e) => {
      return val === e.title ? e.option : null;
    });
    if (value[0]) {
      setMoneyVal(value[0].option);
    } else {
    }
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: `${moneyGoal}`,
    onChange(nextValue) {
      setMoneyGoal(nextValue);
      handleChange(nextValue);
    },
  });

  const handleButtonClick = (event: any) => {
    event.preventDefault();
    setActiveStep(2);
  };
  return (
    <Form onSubmit={(event) => handleButtonClick(event)}>
      <Flex
        flexDir="column"
        alignItems="center"
        height="400px"
        justifyContent="space-between"
      >
        <FormControl isRequired>
          <Flex flexDir="column" alignItems="center">
            <FormLabel>Budget:</FormLabel>
            <HStack {...getRootProps()}>
              {options.map((value) => {
                return (
                  <RadioCard
                    key={value.title}
                    setMoneyVal={setMoneyVal}
                    {...getRadioProps({ value: value.title })}
                    subtext={value.option}
                  >
                    {value.title}
                  </RadioCard>
                );
              })}
            </HStack>
          </Flex>
        </FormControl>

        <Box>
          <FormControl isRequired>
            <Flex flexDir="column" alignItems="center">
              <FormLabel>Deadline:</FormLabel>
              <Input
                isRequired
                onChange={(e) => setDate(e.target.value)}
                type="date"
                name=""
                id=""
                value={date}
                //make sure date is not before current date
              />
            </Flex>
          </FormControl>
        </Box>

        <ButtonGroup>
          <Button onClick={() => setActiveStep(0)}>Prev</Button>
          <Button type="submit">Next</Button>
        </ButtonGroup>
      </Flex>
    </Form>
  );
}
