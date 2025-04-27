import { useState, useEffect, useRef } from 'react';

export function useLongPolling(clientID) {
    const [messages, setMessages] = useState([]);
    const isMounted = useRef(true);
    const doLongPolling = async (clientID) => {
        try {
          const response = await fetch(`http://localhost:3000/poll/${clientID}`);
          if(response.status === 200) {
            const chatMessages = await response.json();
          console.log("Chat messages received:", chatMessages);
           // Ensure the component is still mounted before updating state
           if (isMounted.current) {
            // Update the messages state with the new chat messages
              setMessages((prev) => [...prev, ...chatMessages]); 
              // Starting polling again  
              doLongPolling(clientID); 
                  
          }
          }
          else if(response.status === 204) {
            console.log("polling timeout, connection closed");
            // start polling again, as the connection is closed upon sending response from the server
            doLongPolling(clientID);
          }
         
          else{
            console.error('Unexpected response', response.status);
            doLongPolling(clientID); 
          }
        } catch (error) {
          console.error("Polling error:", error);
          if (isMounted.current) {
            setTimeout(() => doLongPolling(clientID), 10);
          }
        }
      };
    
      useEffect(() => {
        // Start polling when the component mounts
        isMounted.current = true;
        doLongPolling(clientID);
    
        return () => {
          // Cleanup the isMounted flag when the component unmounts
          isMounted.current = false;
        };
      }, []);
    return messages;
}

