import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const URL = 'ws://localhost:3030'

function App() {
  let [ws,setWS] = useState(new WebSocket(URL));
  let [messages,setMessages] = useState(["connecting..."]);
  let [currentMessage,setCurrentMessage] = useState("");

  useEffect(() => {
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
      setMessages([...messages, "connected"]);
    }
    ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      if(message && message.message) {
        setMessages([...messages, message.message]);
      }
    }
    ws.onclose = () => {
      console.log('disconnected')
      setMessages([...messages, "disconnected"]);
      setTimeout(() => {
        setMessages([...messages, "reconnect"]);
        setWS(new WebSocket(URL));
      }, 15000);
    }
  }, []);

  const submitMessage = (messageString: string) => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: "Tate", message: messageString }
    ws.send(JSON.stringify(message));
    setMessages([...messages, messageString]);
    setCurrentMessage("");
  }

  return (
    <div className="App">
      <div>
        {messages.map((m) => 
          <p>{m}</p>
        )}
      </div>
      <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
          />
          <button onClick={() => {submitMessage(currentMessage)}}>Send</button>
    </div>
  );
}

export default App;
