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
import UserInfo from './components/UserInfo';
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
  const [showInfo, setShowInfo] = useState(false);
  const [userToDisplay, setUserToDisplay] = useState([]);
  const [currentUserInfo, setCurrentUserInfo] = useState(user);
  const [messages, setMessages] = useState([]);
  const [notSeenConversation, setNotSeenConversation] = useState({});

  useEffect(() => {
    if (!user) return;
    axios.get('/user/profile', {
      headers: {token: user.token},
      params: {userId: user.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data.user);
      setCurrentUserInfo(response.data.data.user);
    }).catch((err)=>{
      console.log(err)
    })
  },[user])  

  const postLastSeen = async (user, conversationId) => {
    const response = await axios.post('/conversation/lastSeen',{},{
      headers: {token: user.token},
      params: {conversationId: conversationId},
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
    } else {
      console.log(response.data.data);
    }
  }

  useEffect(() => {
    if (!socket) return;
    console.log(`listening message ${currentConversation.id}`);
    socket.on("message", async ({action, data}) => {
      console.log(data);
      switch (action) {
        case 'newMessage': 
          setMessages(prevMessages => {
            let conversation = null
            if (data.chat.conversationId) conversation = prevMessages[data.chat.conversationId];
            if (!conversation) {
              console.log('Not loaded yet');
              return prevMessages;
            }
            console.log(conversation);
            const existed = conversation.find(message => message.id == data.chat.id);
            if (!existed){
              console.log('new message');
              return {...prevMessages, [data.chat.conversationId]:[...(prevMessages[data.chat.conversationId]||[]), data.chat]}
            }
            return prevMessages;
          });
          // increment unseen count by 1
          setConversations(prevConversations => {
            return prevConversations.map(conversation=>{
              if (conversation.id != data.chat.conversationId) return conversation;
              return {...conversation, n_messages: conversation.n_messages + 1};
            })
          })
          break
        case 'update':
          setMessages(prevMessages => {
            console.log(data);
            console.log(prevMessages);
            let conversation = null
            if (!data.chat.conversationId) return prevMessages;
            conversation = prevMessages[data.chat.conversationId];
            if (!conversation) {
              console.log('Not loaded yet');
              return prevMessages;
            }
            console.log(conversation);
            const existedIndex = conversation.findIndex(message => message.id == data.chat.id);
            if (existedIndex==-1){
              console.log('new message');
              return {...prevMessages, [data.chat.conversationId]:[...(prevMessages[data.chat.conversationId]||[]), data.chat]}
            } else {
              return {...prevMessages, 
                [data.chat.conversationId]:prevMessages[data.chat.conversationId].map((message => {
                  if (message.id == data.chat.id) return data.chat;
                  return message;
                }))
              }
            }
          });
        default:
      }
      if (!document.hidden && data.chat && currentConversation && data.chat.conversationId == currentConversation.id) {
        postLastSeen(user, currentConversation.id);
      } else {
        if (data.chat && data.chat.conversationId)setNotSeenConversation(prevList => {return {...prevList, [data.chat.conversationId]: true}});
      }
    });

    return () => {
      socket.off("message");
    }
  }, [socket, currentConversation, user]);

  const handleVisibilityChange = async () => {
    if (!document.hidden && currentConversation && notSeenConversation[currentConversation.id]) {
      await postLastSeen(user, currentConversation.id);
      setNotSeenConversation(prevList => {return {...prevList, [currentConversation.id]: true}});
    }
  };

  useEffect(() => {
    if (!document.hidden && currentConversation && notSeenConversation[currentConversation.id]) {
      postLastSeen(user, currentConversation.id).then(() => {
        setNotSeenConversation(prevList => {return {...prevList, [currentConversation.id]: true}});
      });
    }
  },[currentConversation, user])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  })

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
          setShowInfo={setShowInfo}
          setUserToDisplay={setUserToDisplay}
          currentUserInfo={currentUserInfo}
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
            setShowInfo={setShowInfo}
            setUserToDisplay={setUserToDisplay}
            currentUserInfo={currentUserInfo}
            messages={messages}
            setMessages={setMessages}
          />
        }
      </Row>
      <UserInfo
        user={user}
        userToDisplay={userToDisplay}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        setCurrentUserInfo={setCurrentUserInfo}
        conversations={conversations}
        setCurrentConversation={setCurrentConversation}
      />
    </Container>
  );
}

export default App;
