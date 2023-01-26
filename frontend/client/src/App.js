
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000';

function App() {
  const [message, setMessage] = useState('');
  const [socket] = useState(() => socketIOClient(ENDPOINT));

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server 3002 ganesha',socket.id);
    });
    socket.on('broadcast',(data)=>{
      console.log(data)
    })
  }, [socket]);

  const sendMessage = () => {
    console.log("in register")
    socket.emit('register', message);
    socket.on('registerSuccess',(data)=>{
     console.log(data)
    })
    socket.on('registerError',(data)=>{
      console.log(data)
    })
    setMessage('');
  };
  const sendLogin =()=>{
    console.log("in login")
        socket.emit('login',message)
        socket.on('loginSuccess',(data)=>{
          console.log(data)
         
  socket.emit('join', 'myroom');
socket.on('newClient',data => console.log(data))
socket.on('message', (message) => {
  console.log(`received message: ${message}`);
});

socket.emit('message', 'Hello user2!', 'myroom');

        })
        socket.on('loginFailed',(data)=>{
          console.log(data)
        })
        setMessage('')
        return;
  }

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>register</button>
      <button onClick={sendLogin}>login</button>
    </div>
  );
}

export default App;







