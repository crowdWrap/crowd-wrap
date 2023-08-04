import { Box, useToast } from "@chakra-ui/react";
import { debounce } from "lodash";

import styles from "./recommendation.module.css"
import { useAuth } from "../../../hooks/authContext";
import { useEffect, useState } from "react";
export default function RecommendationPrompt({event}:any){
  const toast = useToast(); 
  const {currentEvent,setCurrentEvent} = useAuth();
  const [content, setContent] = useState(event.gifts);

  useEffect(() => {
    setContent(event.gifts);
  }, [event.gifts]);

  const handleContentChange = debounce(async(value) => {
    const data = JSON.stringify({
      eventId:event.id,
      value
    });
    const response = await fetch("/events/update/brainstorm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const receivedData = await response.json();
    if(response.ok){
      setCurrentEvent(receivedData.event)
      
      toast({
        description: `${receivedData.message}!`,
        status: "success",
        duration: 2000,
      });
    }else{
      toast({
        description: `${receivedData.message}!`,
        status: "error",
        duration: 2000,
      });
    }
  }, 500);
  // (e)=>console.log(e.currentTarget.innerText)

  // Brainstorm time! <br /><br />
      
  // dogs r cool - garv
  // (ps you can edit this)
    return(

<div className={styles.paper}>
  <div className={styles.lines}>
    <Box className={styles.text} contentEditable onKeyUp={(e)=>handleContentChange(e.currentTarget.innerHTML)} spellCheck="false" dangerouslySetInnerHTML={{ __html: content }}/>
  </div>
</div>
    )
}