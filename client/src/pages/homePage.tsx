import {
  Box,
  Center,
  Container,
  Wrap,
  WrapItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FAQSection } from "../components/homePage/faqSection";
import { Feature } from "../components/homePage/feature";
import { HeroSection } from "../components/homePage/heroSection"; 
import { Helmet } from "react-helmet";
import first from "../assets/1.png"
import second from "../assets/2.png"
import third from "../assets/3.png"
import newvid from "../assets/video-2023-07-30_06.48.10.mp4"

const faqs: any[] = [
  {
    q: "How many people can I add to an event?",
    a: "You can bring on 10 people currently.",
  },
  {
    q: "Are there still features being added?",
    a: "Yes! I am currently still adding more things.",
  },

  {
    q: "How does payment work?",
    a: "You will be prompted when you need to pay, and the funds will be sent directly to the hosts paypal."
  },
  {
    q: "Do you support international payments?",
    a: "Yes - payments can be made from and to any country.",
  },
  {
    q: "Who can I connect to for support?",
    a: "Email me at crowdwrap@gmail.com",
  },
];

export interface HighlightType {
  icon: string;
  title: string;
  description: string;
}

interface FeatureType {
  title: string;
  description: string;
  image: string;
}

const features: FeatureType[] = [
  {
    title: "Easy events",
    description:
      "No more spending time to figure out how much you're gifting. Easily create events and assign a budget to your friends in one place.",
    image:
      second,
  },
  {
    title: "Real-time chat",
    description:
      "Know when and how your events are going to be handled.",
    image:
     first,
  },
  {
    title: "Simple payment",
    description:
      "You don't have to hunt for a payment from each person. Easily use the integrated payment to send funds to the host",
    image:
      third,
  },
];

export default function HomePage() {
  return (
    <><Helmet>
      <meta charSet="utf-8" />
      <title>Crowdwrap | Streamline gift giving</title>
    </Helmet>
    <Box bg="gray.50">
        <HeroSection />
        <Container maxW="container.xl">
          <Center p={[0, 10]}>
            <video
              playsInline
              autoPlay
              muted
              loop
            >
              <source
                src={newvid} />
            </video>
          </Center>
        </Container>

        <Container maxW="container.2xl" centerContent py={[20]}>
          <Wrap
            spacing={[10, 40]}
            mt={8}
            align="center"
            justify="center"
            w="full"
          >
            <WrapItem bg={'#93D9F8'} padding={'8px'} borderRadius={'25px'}>
              <Text>Easy and fast</Text>
            </WrapItem>

            <WrapItem bg={"blackAlpha.100"} padding={'8px'} borderRadius={'25px'}>
            <Text>Always in touch</Text>
            </WrapItem>

            <WrapItem bg={'pink.100'} padding={'8px'} borderRadius={'25px'}>
            <Text>Social gifting</Text>
            </WrapItem>

            <WrapItem bg={"blackAlpha.100"} padding={'8px'} borderRadius={'25px'}>
            <Text>Split and pool</Text>
            </WrapItem>


            <WrapItem  bg={'#E9F6FD'} padding={'8px'} borderRadius={'25px'}>
            <Text>Manage wisely</Text>
            </WrapItem>
          </Wrap>
        </Container>

        <VStack
          backgroundColor="white"
          w="full"
          id="features"
          spacing={16}
          py={[16, 0]}
        >
          {features.map(
            ({ title, description, image }: FeatureType, i: number) => {
              return (
                <Feature
                  key={`feature_${i}`}
                  title={title}
                  description={description}
                  image={image}
                  reverse={i % 2 === 1} />
              );
            }
          )}
        </VStack>

        {/* <Container maxW="container.md" centerContent py={[8, 28]}>
          <SimpleGrid spacingX={10} spacingY={20} minChildWidth="300px">
            {highlights.map(({ title, description, icon }, i: number) => (
              <Box p={4} rounded="md" key={`highlight_${i}`}>
                <Text fontSize="4xl">{icon}</Text>

                <Text fontWeight={500}>{title}</Text>

                <Text color="gray.500" mt={4}>
                  {description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container> */}

        <Container py={28} maxW="container.md">
          <Box w="full">
            <VStack spacing={10} w="full">
              <Text fontWeight={500} fontSize="2xl" align="center">
                Frequently asked questions
              </Text>
              <FAQSection items={faqs} />
            </VStack>
          </Box>
        </Container>
      </Box></>
  );
}
