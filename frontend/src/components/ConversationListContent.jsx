import axios from "axios";

const ConversationListContent = ({setCurrentConversation, user}) => {
  axios.get('/conversation', {
    headers: {token: user.token},
    params: {userId: user.userId}})
  .then((response)=>{
    console.log(response);
    if (response.data.error.status == 500) {
      return (
        <div id="conversation_list-container-content">
          <p>{response.error.message}</p>
        </div>
      )
    }
    const conversations = response.data.data.conversations;
    console.log(conversations);
    const handleClick = (conversation) => {
      setCurrentConversation(conversation);
      return;
    }
    const conversationItems = conversations.map((conversation) => {
      console.log(conversation);
      <div
        key={conversation.id}
        id="conversation_list-container-content-item-wrapper"
        onClick={() => handleClick(conversation)}
      >
        <p>
          {conversation.name}
        </p>
      </div>
    });


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