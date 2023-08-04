import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  Tooltip,
  SliderThumb,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { FaMoneyBill } from "react-icons/fa";

export default function AmountPrompt({ events, setAmount }: any) {
  const [sliderValue, setSliderValue] = React.useState(0);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const moneyGoal = events.moneyGoal.substring(1);
  return (
    <Slider
      onChangeEnd={(val) =>
        setAmount(Math.round(moneyGoal * (val / 100) * 100) / 100)
      }
      id="slider"
      defaultValue={0}
      min={0}
      max={100}
      width={'250px'}
      colorScheme="teal"
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
        25%
      </SliderMark>
      <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
        50%
      </SliderMark>
      <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
        75%
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={`$${Math.round(moneyGoal * (sliderValue / 100) * 100) / 100}`}
      >
        <SliderThumb boxSize={6}>
          <Box color="green.500" as={FaMoneyBill} />
        </SliderThumb>
      </Tooltip>
    </Slider>
  );
}
