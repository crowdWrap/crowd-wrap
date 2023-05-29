import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";

function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
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
}: any) {
  const options = ["Budget-friendly", "Mid-Range", "Top-Tier", "Custom"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "budget",
    defaultValue: `${moneyGoal}`,
    onChange: setMoneyGoal,
  });

  const group = getRootProps();

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
        <FormControl>
          <Flex flexDir="column" alignItems="center">
            <FormLabel>Budget:</FormLabel>
            <HStack {...group}>
              {options.map((value) => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </HStack>
          </Flex>
        </FormControl>

        <Box>
          <FormControl>
            <Flex flexDir="column" alignItems="center">
              <FormLabel>Deadline:</FormLabel>
              <Input
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
