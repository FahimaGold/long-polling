import { useLongPolling } from './hooks/useLongPolling';
import './App.css';

function App() {
 const messages = useLongPolling("test_client_1");
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
