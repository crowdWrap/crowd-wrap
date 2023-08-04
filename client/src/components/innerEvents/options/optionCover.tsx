import { Modal, ModalContent, ModalCloseButton, ModalOverlay, Flex, IconButton, useClipboard, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiFillMoneyCollect, AiOutlineForm } from "react-icons/ai";
import { BiGroup, BiShare } from "react-icons/bi";
import { GiSettingsKnobs } from "react-icons/gi";
import PayPrompt from "./payPrompt";
import { useAuth } from "../../../hooks/authContext";
import RecommendationPrompt from "./recommendationPrompt";
import MemberPrompt from "./memberPrompt";
import SettingsPrompt from "./settingsPrompt";

export default function OptionCover({isOpen, onClose, events}:any){
    const { user, currentEvent } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentOption, setCurrentOption] = useState(""); 
    const [ownerPaymentType, setOwnerPaymentType] = useState("none");


    const { onCopy } = useClipboard(`https://crowdwrap.works/events/invite/${currentEvent.inviteLink}`);
    const toast = useToast();
    useEffect(() => {
      (async () => {
        setLoading(true);
        if (events.ownerId) {
          const response = await fetch(
            `/payment/update?userId=${events.ownerId}`,
            {
              method: "GET",
            }
          );
          const receivedData = await response.json();
          setOwnerPaymentType(receivedData.paymentType);
          setLoading(false);
          if (user.id === events.ownerId){
            setCurrentOption("1")
          }else{
            setCurrentOption("2")
          }
        }
      })();
    }, [events.ownerId, user.id]);
    
    return(
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent  margin={'8px'}  height={'500px'}>
                <ModalCloseButton zIndex={99} />
                 
                   <Flex w={'100%'} h={'100%'}>
                    <Flex flexDir={'column'} borderLeftRadius={"5px"}  justifyContent={'space-evenly'} alignItems={'center'} width={'20%'}  bg={'pink.300'}>
                        {!loading &&
                        user.id === events.ownerId && ( 
                        <IconButton onClick={()=>setCurrentOption('1')}  color={currentOption === "1" ? "whiteAlpha.700" :"white"}  cursor={"pointer"} variant="unstyled" _hover={{color:"whiteAlpha.800"}} aria-label="settings" as={GiSettingsKnobs}/>
                        )}
                        <IconButton onClick={()=>setCurrentOption('2')}  color={currentOption === "2" ? "whiteAlpha.700" :"white"} cursor={"pointer"} variant="unstyled"  _hover={{color:"whiteAlpha.800"}} aria-label="members" as={BiGroup}/>
                        <IconButton onClick={()=>setCurrentOption('3')}  color={currentOption === "3" ? "whiteAlpha.700" :"white"} cursor={"pointer"} variant="unstyled" _hover={{color:"whiteAlpha.800"}} aria-label="recommendations" as={AiOutlineForm}/>
                        
                        {!loading &&
                        ownerPaymentType !== "none" &&
                        user.id !== events.ownerId && (
                            <IconButton onClick={()=>setCurrentOption('4')}  color={currentOption === "4" ? "whiteAlpha.700" :"white"} cursor={"pointer"} variant="unstyled"_hover={{color:"whiteAlpha.800"}} aria-label="pay" as={AiFillMoneyCollect}/>
                        )}
                        <IconButton onClick={()=>{
                                          onCopy();
                                          toast({
                                            title: "Invite link copied to clipboard.",
                                            status: "success",
                                            duration: 2000,
                                          });
                        }} cursor={"pointer"} variant="unstyled" color={"white"} _hover={{color:"whiteAlpha.800"}} aria-label="share" as={BiShare}/>
                    </Flex>
                    <Flex width={'80%'}>
                        {currentOption === "1" && (
                           <SettingsPrompt/>
                        )} 
                        {currentOption === "2" && (
                          <MemberPrompt/>
                        )} 
                        {currentOption === "3" && (
                            <RecommendationPrompt event={events}/>
                        )}   
                        {currentOption === "4" && (
                            <PayPrompt
                            email={ownerPaymentType.substring(7)}
                            
                            />
                        )}                     
                    </Flex>
                   </Flex>
             
            </ModalContent>
        </Modal>
    )
}