import React, { useState } from 'react';
import './App.scss';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { io } from "socket.io-client";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuContainer from './components/MenuContainer';
import ConversationListContainer from './components/ConversationListContainer';
import ConversationContentContainer from './components/ConversationContentContainer';
import Auth from './components/Auth';
import serverUrlConfig from './configs/serverUrl.config';

axios.defaults.baseURL = serverUrlConfig;

const cookie = new Cookies();
const authToken = cookie.get('token');
if (authToken) {
  axios.defaults.headers.common['token'] = 'authToken'
/*   const socket = io(serverUrlConfig,{
    auth: {
      token: authToken
    }
  }); */
}

function App() {
  const [createType, setCreateType] = useState('');
  const [createTypeId, setCreateTypeId] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConversation, setCurrentConversation] = useState([])

  if(!authToken) return <Auth />
  const user = {
    token: cookie.get('token'),
    userId: cookie.get('userId'),
    hashedPassword: cookie.get('hashedPassword'),
    firstName: cookie.get('firstName'),
    lastName: cookie.get('lastName'),
    avatarUrl: cookie.get('avatarUrl')
  }

  return (
    <Container fluid id="App" className="App">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"></link>
      <Row id='App_content' className='g-0'>
        <ConversationListContainer
          //socket={socket}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
          user={user}
        />

        {currentConversation.length==0
          ? <div className="col-md-8">Select a conversation to start messaging.</div>
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
  );
}

export default App;
