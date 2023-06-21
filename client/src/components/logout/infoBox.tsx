import { Card, Heading } from "@chakra-ui/react";

export default function InfoBox({ text, heading }: any) {
  return (
    <Card variant="outline" alignItems="center" padding="20px">
      <Heading size="sm">{text}</Heading>
      <Heading color="gray.500" size="xs">
        {heading}
      </Heading>
    </Card>
  );
}
