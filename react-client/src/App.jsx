import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const clientID = "test_client_1";
  const isMounted = useRef(true);

  // Long polling logic
  const doLongPolling = async (clientID) => {
    try {
      const response = await fetch(`http://localhost:3000/poll/${clientID}`);
      if(response.status === 204) {
        console.log("polling timeout, connection closed");
      }
      else if(response.status === 200) {
        const chatMessages = await response.json();
      console.log("Chat messages received:", chatMessages);
       // Ensure the component is still mounted before updating state
       if (isMounted.current) {
        // Update the messages state with the new chat messages
          setMessages((prev) => [...prev, ...chatMessages]);        
      }
      }
      else{
        console.error('Unexpected response', response.status);
      }
      // Recurse for long polling with a delay of 100 ms
      if (isMounted.current) {
        setTimeout(() => {
          doLongPolling(clientID);
        }, 100); // wait 100ms before retrying the next polling
      }
    } catch (error) {
      console.error("Polling error:", error);
      // Retry after 500ms if an error occurs (connection closure or other issue)
      if (isMounted.current) {
        setTimeout(() => doLongPolling(clientID), 500); 
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

  return (
    <>
      <div>
        <h1>Long Polling</h1>
        {console.log(`messages: ${messages}`)}
        {messages.length === 0 && <p>No messages yet</p>}

        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
