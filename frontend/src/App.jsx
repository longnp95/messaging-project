import React, { useState } from 'react';
import './App.css';
import Cookies from 'universal-cookie';
import { io } from "socket.io-client";
import GroupListContainer from './components/GroupListContainer';
import GroupContentContainer from './components/GroupContentContainer';
import Auth from './components/Auth';
import serverUrl from './configs/serverUrl.config';

const cookie = new Cookies();
const authToken = cookie.get('token');
if (authToken) {
  const socket = io(serverUrl,{
    auth: {
      token: authToken
    }
  });
}

function App() {
  const [menuToggle, setMenuToggle] = useState(false);
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth />


  return (
    <div className="App">
      <div id='App_content'>
        <GroupListContainer
          socket={socket}
          menuToggle={menuToggle}
          setMenuToggle={setMenuToggle}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />

        <GroupContentContainer
          socket={socket}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </div>
    </div>
  );
}

export default App;
