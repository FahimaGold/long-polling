import { useState, useEffect } from 'react'


import './App.css'

function App() {
 const [ messages, setMessages ] = useState([])
 // Long polling logic
 const doLongPolling = async (clientID)=> {
   try {
     const response = await fetch(`http://localhost:3001/poll/${clientID}`);
     const chatMessages = await response.json();
     console.log(chatMessages);
     setMessages(chatMessages);
   } catch (error) {
     console.error(error);
     // retry in 2 seconds
     setTimeout(() => doLongPolling(clientID), 2000);
   }
 }
 useEffect(() => {
   const clientID = "test_client_1";
   doLongPolling(clientID);
 }, []);
  return (
    <>
      <div>
        <h1>Long Polling</h1>
        <ul>
        {messages.map((msg, idx) => <li key={idx}>{msg}</li>)}
      </ul>
       </div>
    </>
  )
}

export default App
