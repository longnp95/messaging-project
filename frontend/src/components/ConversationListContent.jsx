import axios from "axios";

const ConversationListContent = ({setCurrentConversation, user}) => {
  axios.get('/conversation', {
    headers: {token: user.token},
    params: {userId: user.userId}})
  .then((response)=>{
    if (response.error.status == 500) {
      return (
        <div id="conversation_list-container-content">
          <p>{response.error.message}</p>
        </div>
      )
    }
    const conversations = response.data;
  
    const handleClick = (conversation) => {
      setCurrentConversation(conversation);
      return;
    }
    const conversationItems = conversations.map((conversation) =>
      <div
        key={conversation.conversationId}
        id="conversation_list-container-content-item-wrapper"
        onClick={() => handleClick(conversation)}
      >
        <p>
          {conversation.conversationName}
        </p>
      </div>
    );


    return (
      <div id="conversation_list-container-content">
        {conversationItems}
      </div>
    );
  }).catch((err)=>{
    return (
      <div id="conversation_list-container-content">
        <p>{err}</p>
      </div>
    )
  })
}

export default ConversationListContent;