import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ImageLoader from '../services/ImageLoader.services'


const MessageListContent = ({messages, user}) => {
  const [messageEnd, setMessageEnd] = useState();
  const isFirstOfSenderGroup = (message, index) => {
    return index===0 || messages[index-1].userId !== message.userId
  }

  const isNewDay = (message, index) => {
    return index===0 || false
  }

  const listItems = messages.map((message, index) => {
    const newDay = isNewDay(message, index);
    const firstInGroup = isFirstOfSenderGroup(message, index);
    
    return (
      <div 
        id="message_list-container-content-item-wrapper" 
        key={message.id}
      >
        {/*Display date*/}
        {newDay && (
          <div className="divider d-flex flex-row justify-content-center mb-4">
            <p
              className="text-center mx-3 mb-0"
              style={{ color: "#a2aab7" }}
            >
              Today
            </p>
          </div>
        )}
        {/*Display [avatar], [senderName], message, sendTime*/}
        <div 
          className={`d-flex flex-row justify-content-${message.userId!=user.id ? 'start': 'end'}`}
          style={{position: "relative"}}
        >
          {/*Avatar*/}
          {message.userId!=user.id && (newDay || firstInGroup) && (
            <ImageLoader
              roundedCircle
              src={message.user.avatar}
              alt="avatar"
              style={{ width: "40px", height: "40px", position: "absolute"}}
            />
          )}
          {/*senderName, message */}
          <div>
            <div
              className={`small p-2 mb-1 rounded-3 ${message.userId==user.id ? 'text-white bg-primary': ''}`}
              style={{ 
                backgroundColor: "#f5f6f7", 
                marginLeft: message.userId===user.id ? 'auto':"45px"
              }}
            >
              {message.userId!=user.id && (newDay || firstInGroup) && (
                <div className="senderName">{message.user.firstName}</div>
              )}
              <div>{message.content}</div>
            </div>
          </div>
          {/*SendTime*/}
          <div className="small ms-2 rounded-3 text-muted align-self-end">
            23:58
          </div>
        </div>
      </div>
    )
  });

  const scrollToBottom = () => {
    messageEnd && messageEnd.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  })

  return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'scroll'}}
    >
      {listItems}
      <div style={{ float:"left", clear: "both" }}
        ref={(el) => { setMessageEnd(el)}}>
      </div>
    </Card.Body>
  );
}

export default MessageListContent;