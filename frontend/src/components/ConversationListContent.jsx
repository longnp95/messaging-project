import React, { useState, useEffect } from 'react';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import ImageLoader from '../services/ImageLoader.services';
import UserTooltip from './UserTooltip';
import moment from 'moment';
import Badge from 'react-bootstrap/Badge';

const ConversationListContent = ({socket, conversations, setConversations, currentConversation, setCurrentConversation, user, searchText, setUserToDisplay, setShowInfo}) => {
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    console.log('getting conversations list');
    axios.get('/conversation', {
      headers: {token: user.token},
      params: {userId: user.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data.conversations);
      setConversations(response.data.data.conversations);
    }).catch((err)=>{
      console.log(err)
    })
    
  },[user])


  useEffect(() => {
    setSuggestions([]);
    axios.get('/user/search', {
      headers: {token: user.token},
      params: {search: searchText}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data.users)
      setSuggestions(response.data.data.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[searchText,user])

  useEffect(() => {
    console.log('listening conversation socket')
    socket.on("conversation", ({action, data}) => {
      switch (action) {
        case 'create': 
          setConversations(prevConversations =>{
            const existed = prevConversations.find(conversation => conversation.id == data.conversation.id);
            if (!existed) return [...prevConversations, data.conversation];
            return prevConversations;
          });
          break
        case 'update':
          setConversations(prevConversations =>{
            let found = false;
            const nextConversations = prevConversations.map(conversation => {
              if (conversation.id == data.conversation.id) {
                found = true;
                return {...data.conversation, n_messages:conversation.n_messages};
              } else {
                return conversation;
              }
            });
            if (!found) return [...nextConversations, data.conversation];
            return nextConversations;
          });
          break
        case 'delete':
          if (currentConversation.id == data.conversationId) setCurrentConversation([]);
          setConversations(prevConversations => prevConversations.filter(conversation => conversation.id!=data.conversationId));
          break
        default:
      }
    });

    return () => {
      socket.off("conversation");
    }
  }, [socket]);

  useEffect(() => {
    const currentConversationItem = document.getElementById('current_conversation-container');
    if (!currentConversationItem) return;
    const scrollAreaRect = document.getElementById('conversation_list-container-content').getBoundingClientRect();
    const currentConversationRect = currentConversationItem.getBoundingClientRect();
    if (currentConversationRect.top < scrollAreaRect.top) {
      currentConversationItem.scrollIntoView(/* { behavior: "smooth" } */);
    } else if (currentConversationRect.bottom > scrollAreaRect.bottom) {
      currentConversationItem.scrollIntoView({ /* behavior: "smooth",  */block: "end", inline: "nearest"});  
    }
  }, [currentConversation])

  const handleClick = (conversation) => {
    setCurrentConversation(conversation);
    return;
  }

  const handleClickSuggestion = async (suggestion) => {

    const conversation = conversations.find(el => el.typeId==1 && (el.partnerId == suggestion.id || el.creatorId == suggestion.id));
    if (conversation) {
      setCurrentConversation(conversation);
    } else {
      const response = await axios.post('/conversation/create',{
        conversationName: 'DirectMessage',
        conversationAvatarUrl: '',
        typeConversation: 1,
        partnerId: suggestion.id
      },{
        headers: {token: user.token},
        params: {userId: user.id},
      });
      if (response.data.error.status == 500) {
        alert(response.data.error.message);
        return;
      }
      setCurrentConversation(response.data.data.conversation);
    }
  }

  const isToday = (date) => {
    const now = new Date();
    if (now.toDateString() === date.toDateString()){
      return true;
    } else {
      return false;
    }
  }

  const conversationItems = conversations
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  .map((conversation) => {
    const updatedAt = new Date(conversation.updatedAt);
    let nameToDisplay = conversation.name;
    let avatarToDisplay = conversation.avatar;
    let userToDisplay;
    let conversationType = "Group";
    if (conversation.typeId==1) {
      conversationType = "Direct";
      if (conversation.partnerId != user.id && conversation.partner) {
        nameToDisplay = [conversation.partner.firstName, conversation.partner.lastName].join(' ');
        avatarToDisplay = conversation.partner.avatar;
        userToDisplay = conversation.partner;
      } else if (conversation.creatorId != user.id && conversation.creator) {
        nameToDisplay = [conversation.creator.firstName, conversation.creator.lastName].join(' ');
        avatarToDisplay = conversation.creator.avatar;
        userToDisplay = conversation.creator;
      }
    }
    if (!nameToDisplay.toLowerCase().includes(searchText.toLowerCase())) return <React.Fragment key={conversation.id}/>;
    return (
      <Row
        key={conversation.id}
        id={`${conversation.id==currentConversation.id? 'current_conversation-container' : 'conversation-item-container'}`}
        onClick={() => handleClick(conversation)}
        className={`mx-0 py-1 ps-1 flex-nowrap ${conversation.id==currentConversation.id? 'bg-info' : ''} ${userToDisplay ? 'tooltipHover' : ''}`}
        style={{ position: "relative" }}
      >
        <Col className="g-0 border-right">
          <ImageLoader
            roundedCircle alt="Avatar" 
            src={avatarToDisplay}
            style={{ width: "50px", height: "auto", aspectRatio: "1"}}
          />
        </Col>
        <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
          <div id='conversation-name' className='d-flex flex-row justify-content-between flex-nowrap'>
            <div
              className='text-truncate'
            >
              {nameToDisplay}
            </div>
            <span id='conversation-preview' className=''>{isToday(updatedAt)? moment(updatedAt).format("hh:mm") : moment(updatedAt).format("DD/MM/YY")}</span>
          </div>
          <div id='conversation-preview' className='d-flex flex-row justify-content-between flex-nowrap'>
            <div
              className='text-truncate'
            >
              {conversation.last_message}
            </div>
            {conversation.n_messages
            ? <Badge pill bg="secondary">{conversation.n_messages}</Badge>
            : <span className=''>{conversationType}</span>
            }
          </div>
        </Col>
      </Row>
    )
  });

  const suggestionItems = suggestions
  .map((suggestion) => {
    if (suggestion.id == user.id) return <React.Fragment key={suggestion.id}/>;
    if (!suggestion.username.toLowerCase().includes(searchText.toLowerCase())
      && ![suggestion.firstName, suggestion.lastName].join(' ').toLowerCase().includes(searchText.toLowerCase())
    ) return <React.Fragment key={suggestion.id}/>;
    return (
      <Row
        key={suggestion.id}
        id="conversation-item-container"
        onClick={()=>{
          setUserToDisplay(suggestion);
          setShowInfo(true);
        }}
        className={`mx-0 py-1 ps-1 flex-nowrap`}
      >
        <Col className="g-0 border-right">
          <ImageLoader
            roundedCircle alt="Avatar" 
            src={suggestion.avatar}
            style={{ width: "50px", height: "auto", aspectRatio: "1"}}
          />
        </Col>
        <Col xs={8} className="ms-1 flex-grow-1 px-0 px-sm-1">
          <div id='conversation-name'>
            {[suggestion.firstName, suggestion.lastName].join(' ')}
          </div>
          <div id='conversation-preview'
            className='text-truncate'
          >
            {`@${suggestion.username}`}
          </div>
        </Col>
      </Row>
    )
  });

  return (
    <div id="conversation_list-container-content"
    className='flex-grow-1'
    style={{overflowY: 'auto'}}
    >
      {conversationItems}
      <hr className='my-0'/>
      <div className='text-truncate text-info'>
        User suggestions
      </div>
      {suggestionItems}
    </div>
  );
}

export default ConversationListContent;