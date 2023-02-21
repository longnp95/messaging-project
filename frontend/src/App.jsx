import React, { useState, useEffect } from 'react';
import './App.scss';
import Cookies from 'universal-cookie';
import axios from 'axios';
import io from "socket.io-client";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuContainer from './components/MenuContainer';
import ConversationListContainer from './components/ConversationListContainer';
import ConversationContentContainer from './components/ConversationContentContainer';
import Auth from './components/Auth';

console.log(window.location.hostname);

// axios.defaults.baseURL = serverUrlConfig;
axios.defaults.baseURL = "http://" + window.location.hostname + ":8080";
const cookie = new Cookies();
const authToken = cookie.get('token');
if (authToken) {
  axios.defaults.headers.common['token'] = 'authToken';
}
const user = cookie.get('user');

function App() {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(cookie.get('token'));
  useEffect(() => {
    if(!token) return;
    const newSocket = io("http://" + window.location.hostname + ":8080", {
      extraHeaders: {token: token, "Content-Type": "application/json"},
      auth: {
        token: token
      }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, token]);
  const [newPartner, setNewPartner] = useState();
  const [createType, setCreateType] = useState('');
  const [createTypeId, setCreateTypeId] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  if(!socket) return <Auth />
    
  return (
    <Container fluid id="App" className="App g-0">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"></link>
      <Row id='App_content' className='g-0'>
        <ConversationListContainer
          socket={socket}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          conversations={conversations}
          setConversations={setConversations}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
          user={user}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />

        {currentConversation.length==0
          ? <div className={`col-8 d-${currentConversation.length==0 ? 'none': 'block'} d-sm-block`}
            style={{margin: "auto", textAlign: "center"}}
            >
              Select a conversation to start messaging.
            </div>
          : <ConversationContentContainer
            socket={socket}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
            conversations={conversations}
            setConversations={setConversations}
            setCurrentConversation={setCurrentConversation}
            currentConversation={currentConversation}
            user={user}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        }
      </Row>
    </Container>
  );
}

export default App;
