import {
    Box,
    Button,
    Center,
    Container,
    Stack,
    Text,
    VStack,
    Image,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
  
  interface FeatureProps {
    title: string;
    description: string;
    image: string;
    reverse?: boolean;
  }
  
  export const Feature: FunctionComponent<FeatureProps> = ({
    title,
    description,
    image,
    reverse,
  }: FeatureProps) => {
    const rowDirection = reverse ? "row-reverse" : "row";
    const navigate = useNavigate();
    return (
      <Center w="full" minH={[null, "90vh"]}>
        <Container maxW="container.xl" rounded="lg">
          <Stack
            spacing={[4, 16]}
            alignItems="center"
            direction={["column", null, rowDirection]}
            w="full"
            h="full"
          >
            <Box rounded="lg">
              <Image
                objectFit="scale-down"
                src={image}
                width={684}
                height={433}
                alt={`Feature: ${title}`}
              />
            </Box>
  
            <VStack maxW={500} spacing={4} align={["center", "flex-start"]}>
              <Box>
                <Text fontSize="3xl" fontWeight={600} align={["center", "left"]}>
                  {title}
                </Text>
              </Box>
  
              <Text fontSize="md" color="gray.500" textAlign={["center", "left"]}>
                {description}
              </Text>
  
              <Button
                colorScheme="brand"
                variant="link"
                textAlign={["center", "left"]}
                onClick={()=>navigate("/register")}
              >
                Learn more →
              </Button>
            </VStack>
          </Stack>
        </Container>
      </Center>
    );
  };