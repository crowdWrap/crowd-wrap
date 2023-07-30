import {
    Button,
    Center,
    Container,
    Heading,
    Highlight,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
  
  interface HeroSectionProps {}
  
  export const HeroSection: FunctionComponent<HeroSectionProps> = () => {
    const navigate = useNavigate();
    return (
      <Container maxW="container.lg">
        <Center p={4} minHeight="70vh">
          <VStack>
            <Container maxW="container.md" textAlign="center">
              <Heading size="2xl" letterSpacing={'-2px'} mb={4} color="gray.700">
              <Highlight query='amazing' styles={{ px:"3",py:"1", rounded: 'full', bg: 'pink' }}>
              Get Inspired, give amazing gifts and make memories.
              </Highlight>
            
              </Heading>
  
              <Text fontSize="s" color="gray.500">
              Enjoy the transformative power of gift giving, lightening fast pooling, and a synergetic friend feed.
              </Text>
  
              <Button
                mt={8}
                colorScheme="pink"
                onClick={() => {
                  navigate("/register")
                }}
              >
                I need this  →
              </Button>
{/*   
              <Text my={2} fontSize="sm" color="gray.500">
                102+ builders have signed up in the last 30 days
              </Text> */}
            </Container>
          </VStack>
        </Center>
      </Container>
    );
  };