import React, { useState, useEffect } from 'react';
import './App.scss';
import Cookies from 'universal-cookie';
import axios from 'axios';
import io from "socket.io-client";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuContainer from './components/MenuContainer';
import {SocketContext, socket} from './context/socket';
import ConversationListContainer from './components/ConversationListContainer';
import ConversationContentContainer from './components/ConversationContentContainer';
import Auth from './components/Auth';
import serverUrlConfig from './configs/serverUrl.config';

axios.defaults.baseURL = serverUrlConfig;

const cookie = new Cookies();
const authToken = cookie.get('token');
if (authToken) {
  axios.defaults.headers.common['token'] = 'authToken';
}
const currentUser ={
  token: cookie.get('token'),
  id: cookie.get('userId'),
  hashedPassword: cookie.get('hashedPassword'),
  firstName: cookie.get('firstName'),
  lastName: cookie.get('lastName'),
  avatarUrl: cookie.get('avatarUrl')
}

function App() {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [createType, setCreateType] = useState('');
  const [createTypeId, setCreateTypeId] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([])
  
  if(!authToken) return <Auth />
  const user ={
    token: authToken,
    id: cookie.get('userId'),
    hashedPassword: cookie.get('hashedPassword'),
    firstName: cookie.get('firstName'),
    lastName: cookie.get('lastName'),
    avatarUrl: cookie.get('avatarUrl')
  }
  
  return (
    <SocketContext.Provider value={socket}>
      <Container fluid id="App" className="App g-0">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"></link>
        <Row id='App_content' className='g-0'>
          <ConversationListContainer
            //socket={socket}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
            conversations={conversations}
            setConversations={setConversations}
            currentConversation={currentConversation}
            setCurrentConversation={setCurrentConversation}
            user={user}
          />

          {currentConversation.length==0
            ? <div className="col-8">Select a conversation to start messaging.</div>
            : <ConversationContentContainer
              //socket={socket}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              createType={createType}
              currentConversation={currentConversation}
              user={user}
            />
          }
        </Row>
      </Container>
    </SocketContext.Provider>
  );
}

export default App;
