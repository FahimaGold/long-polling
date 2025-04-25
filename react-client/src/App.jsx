import { useState, useEffect, useRef } from 'react'


import './App.css'

function App() {
 const [ messages, setMessages ] = useState([]);
 const isMounted = useRef(true);
 // Long polling logic
 const doLongPolling = async (clientID)=> {
   try {
     const response = await fetch(`http://localhost:3001/poll/${clientID}`);
     const chatMessages = await response.json();
     console.log(chatMessages);
     if (!isMounted.current) return;
     setMessages((prev) => [...prev, ...chatMessages]);
     doLongPolling(clientID);
   } catch (error) {
     console.error(error);
     // retry in 2 seconds
     setTimeout(() => doLongPolling(clientID), 2000);
   }
 }
 useEffect(() => {
   const clientID = "test_client_1";
   doLongPolling(clientID);
   return () => {
    isMounted.current = false; // stop polling if component unmounts
  };
 }, []);
  return (
    <>
      <div>
        <h1>Long Polling</h1>
        {messages.length === 0 && <p>No messages yet</p>}
        <ul>
        {messages.map((msg, idx) => <li key={idx}>{msg}</li>)}
      </ul>
       </div>
    </>
  )
}

export default App
