const ConversationContentHeader = ({currentConversation}) => {
  return (
    <div id="conversation_content-header-wrapper" className="settings-tray">
      <div className="friend-drawer no-gutters friend-drawer--grey">
        <div className="text">
          <h6 id="conversation_content-header-conversation_name">{currentConversation.conversationName}</h6>
        </div>
        <span className="settings-tray--right">
          <i className="material-icons">menu</i>
        </span>
      </div>
    </div>
  )
}

export default ConversationContentHeader