import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image';
import Blank_Avatar from '../public/Blank-Avatar.png';
import AddMemberForm from './AddMemberForm';
import MemberList from './MemberList';
import ConfirmationModal from './ConfirmationModal';

const ConversationContentHeader = ({currentConversation, user, roles, setCurrentConversation, setConversations, isAdding, setIsAdding}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('Are you sure?');
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get('/conversation/getMember', {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data.data)
      console.log(response.data.data.conversation.users);
      setMembers(response.data.data.conversation.users);
    }).catch((err)=>{
      console.log(err)
    })
  },[currentConversation,user,isAdding,showMembers])

  const isLeader = members.find(el=>el.id==user.id && el.group_member.roleId==1)

  const deleteConversation = () => {
    axios.post('/conversation/delete',{}, {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data);
      setCurrentConversation([]);
      setConversations(prevConversations => prevConversations.filter(conversation => conversation.id!=currentConversation.id));
    }).catch((err)=>{
      console.log(err)
    })
  }
  console.log("currentConversation:",currentConversation);
  const leaveConversation = () => {
    axios.post('/conversation/leaveGroup',{}, {
      headers: {token: user.token},
      params: {conversationId: currentConversation.id}})
    .then((response)=>{
      if (response.data.error.status === 500) {
        return (
          console.log(response.data.error.message)
        )
      }
      console.log(response.data);
      setCurrentConversation([]);
      setConversations(prevConversations => prevConversations.filter(conversation => conversation.id!=currentConversation.id));
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  const cancelConfirm = () => {
    setConfirmAction(() => () => {});
    setConfirmMessage('Are you sure?');
  }

  const errorHandler = (event) => {
    event.currentTarget.src = Blank_Avatar;
  };
  let nameToDisplay = currentConversation.name;
  let avatarToDisplay = currentConversation.avatar;
  if (currentConversation.typeId==1) {
    if (currentConversation.partnerId != user.id && currentConversation.partner) {
      nameToDisplay = [currentConversation.partner.firstName, currentConversation.partner.lastName].join(' ');
      avatarToDisplay = currentConversation.partner.avatar;
    } else if (currentConversation.creatorId != user.id && currentConversation.creator) {
      nameToDisplay = [currentConversation.creator.firstName, currentConversation.creator.lastName].join(' ');
      avatarToDisplay = currentConversation.creator.avatar;
    }
  }
  return (
    <Card.Header id="conversation_content-header-wrapper" 
      className="d-flex justify-content-between align-items-center p-3 g-0 bg-info text-white"
      style={{ borderRadius: "0" }}
    >
      <i id="currentConversationToggle" className="material-icons d-sm-none" onClick={()=>setCurrentConversation([])}>arrow_back</i>
      <Image 
        roundedCircle alt="Avatar" 
        src={avatarToDisplay||Blank_Avatar} 
        style={{ width: "30px", height: "auto", aspectRatio: "1" }}
        className="d-none d-sm-block"
        onError={(event)=>errorHandler(event)}
      />
      <p className="mb-0 fw-bold">{nameToDisplay}</p>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic" variant="info" className='p-0'>
          <i className="material-icons">more_vert</i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {(currentConversation.typeId!=1)&&
            <Dropdown.Item onClick={() => setIsAdding(true)}>Add Member</Dropdown.Item>
          }
          <Dropdown.Item onClick={() => setShowMembers(true)}>Member List</Dropdown.Item>
          {(currentConversation.typeId!=1)&&
            <Dropdown.Item 
              onClick={() => {
                setConfirmMessage('Are you sure to leave group?'); 
                setConfirmAction(()=>leaveConversation); 
                setConfirming(true)
              }}
            >
              Leave Group
            </Dropdown.Item>
          }
          {(currentConversation.typeId!=1)&&isLeader&&
            <Dropdown.Item 
            onClick={() => {
              setConfirmMessage('Are you sure to delete group?'); 
              setConfirmAction(()=>deleteConversation); 
              setConfirming(true)
            }}
          >
            Delete Group
          </Dropdown.Item>
        }
        </Dropdown.Menu>
      </Dropdown>
      <AddMemberForm
        members={members}
        setMembers={setMembers}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
      />
      <MemberList 
        members={members}
        setMembers={setMembers}
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        setIsAdding={setIsAdding}
        currentConversation={currentConversation}
        user={user}
        roles={roles}
        setConfirmMessage={setConfirmMessage}
        setConfirmAction={setConfirmAction}
        setConfirming={setConfirming}
        setConversations={setConversations}
        setCurrentConversation={setCurrentConversation}
      />
      <ConfirmationModal
        message={confirmMessage}
        show={confirming}
        setShow={setConfirming}
        confirmAction={confirmAction}
        cancelAction={cancelConfirm}
      />
    </Card.Header>
  )
}

export default ConversationContentHeader