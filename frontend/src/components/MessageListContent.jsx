const MessageListContent = ({messages, userId}) => {
  const listItems = messages.map((message) =>
    <div 
      id="message_list-container-content-item-wrapper" 
      key={message.messageId} 
      className={message.senderId==userId ? 'sent' : 'received'}
    >
      {message.senderId!=userId && (
        <p className="senderName">{message.senderName}</p>
      )}
      <p>{message.content}</p>
    </div>
  );


  return (
    <div id="message_list-container-content">
      {listItems}
    </div>
  );
}

export default MessageListContent;