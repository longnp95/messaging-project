import React, { useState } from 'react';
import './App.scss';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { io } from "socket.io-client";
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
  const [menuToggle, setMenuToggle] = useState(false);
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConversation, setCurrentConversation] = useState([])

  if(!authToken) return <Auth />


  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"></link>
      {menuToggle && (
        <MenuContainer/>
      )}
      <div id='App_content' className='row no-gutters' onClick={()=>{if (menuToggle) setMenuToggle(false)}}>
        <ConversationListContainer
          //socket={socket}
          menuToggle={menuToggle}
          setMenuToggle={setMenuToggle}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          currentConversation={currentConversation}
          setCurrentConversation={setCurrentConversation}
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
          />
        }
      </div>
    </div>
  );
}

export default App;
