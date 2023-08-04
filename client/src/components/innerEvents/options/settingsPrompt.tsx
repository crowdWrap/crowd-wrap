import { Button, ButtonGroup, Flex, FormControl, FormLabel, Input, InputGroup, Textarea, useToast } from "@chakra-ui/react";
import FileUpload from "../../setUsername/fileUpload";
import { Form } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/authContext";

export default function SettingsPrompt(){
  const {currentEvent, setCurrentEvent} = useAuth();
    const [budget, setBudget] = useState(currentEvent.moneyGoal);
    const [title, setTitle] = useState(currentEvent.title);
    const [description, setDescription] = useState(currentEvent.description);
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSubmit = async (event:any) => {
        event.preventDefault();

    setLoading(true);

      const data = JSON.stringify({
        eventId:currentEvent.id,
        title,
        description,
        budget
      });
    
      const response = await fetch("/events/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const receivedData = await response.json();
      if (response.ok) {
        setCurrentEvent(receivedData.event)
        toast({
          title: receivedData.message,
          status: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: receivedData.message,
          status: "error",
          duration: 4000,
        });
      }
      setLoading(false);
    }
   
    

    const handleBudgetChange = (e: any) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, "");
      
        setBudget("$" + numericValue);
    }
    return(

        <Flex flexDir={'column'} alignItems={'center'} width={'100%'}  paddingTop={'25px'}>
          <FileUpload thePicture={"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"} boxSize={'75px'} />
        <Form onSubmit={handleSubmit}>
         <Flex flexDir={'column'} gap={'25px'} padding={'10px'} paddingTop={'20px'}>
            <FormControl variant="floating" id="title" isRequired>
                <Input
                    // borderColor="white"
                    
                    placeholder=" "
                    transition="0.25s ease-in-out"
                    minLength={4}
                    maxLength={20}
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <FormLabel backgroundColor="pink">Title</FormLabel>
            </FormControl>

            <FormControl variant="floating" id="description">
                <Textarea
                    // borderColor="white"
                    placeholder=""
                    transition="0.25s ease-in-out"
                    resize="none"
                    maxLength={132}
                    height={'125px'}
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />
                <FormLabel backgroundColor="pink">Description</FormLabel>
            </FormControl>

            <FormControl variant="floating" id="budget" isRequired>
                    <Input
                     placeholder=""
                     minLength={1}
                     maxLength={4}
                     value={budget}
                     onChange={handleBudgetChange}
                    />
            <FormLabel backgroundColor="red">Budget</FormLabel>

            </FormControl>


            <ButtonGroup  >
               
                <Button isLoading={loading} colorScheme="blue"  onClick={()=>{
                    setBudget(currentEvent.moneyGoal)
                    setTitle(currentEvent.title)
                    setDescription(currentEvent.description)
                }}>Reset</Button>
                <Button isLoading={loading} flexGrow={'1'}  type="submit" colorScheme="green">Save</Button>
            </ButtonGroup> 
         </Flex> 
        </Form>
        </Flex>
        
    )
}