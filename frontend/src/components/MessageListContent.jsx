const MessageListContent = ({messages, userId}) => {
  const listItems = messages.map((message) =>
    <p key={message.messageId} className={message.senderId==userId ? 'sent' : 'received'}>
      {message.content}
    </p>
  );


  return (
    <div id="message_list-container-content">
      {listItems}
    </div>
  );
}

export default MessageListContent;