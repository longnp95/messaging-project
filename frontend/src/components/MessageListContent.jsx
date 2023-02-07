import Card from 'react-bootstrap/Card';
import Blank_Avatar from '../public/Blank-Avatar.png'
import Image from 'react-bootstrap/Image';

const MessageListContent = ({messages, userId}) => {
  const listItems = messages.map((message) =>
    <div 
      id="message_list-container-content-item-wrapper" 
      key={message.id}
    >
      <div className="divider d-flex flex-row justify-content-center mb-4">
        <p
          className="text-center mx-3 mb-0"
          style={{ color: "#a2aab7" }}
        >
          Today
        </p>
      </div>
      <div 
        className={`d-flex flex-row justify-content-${message.userId!==userId ? 'start': 'end'}`}
        style={{position: "relative"}}
      >
        {message.userId!=userId && (
          <Image
            roundedCircle
            src={message.user.avatar||Blank_Avatar}
            alt="avatar"
            style={{ width: "40px", height: "auto", position: "absolute"}}
          />
        )}
        <div>
          <div
            className={`small p-2 mb-1 rounded-3 ${message.userId===userId ? 'text-white bg-primary': ''}`}
            style={{ 
              backgroundColor: "#f5f6f7", 
              marginLeft: message.userId===userId ? 'auto':"45px"
            }}
          >
            {message.userId!=userId && (
              <div className="senderName">{message.user.firstName}</div>
            )}
            <div>Hi</div>
          </div>
          <p
            className="small p-2 ms-3 mb-1 rounded-3"
            style={{ backgroundColor: "#f5f6f7" }}
          >
            How are you ...???
          </p>
          <p
            className="small p-2 ms-3 mb-1 rounded-3"
            style={{ backgroundColor: "#f5f6f7" }}
          >
            What are you doing tomorrow? Can we come up a bar?
          </p>
          <p className="small ms-3 mb-3 rounded-3 text-muted">
            23:58
          </p>
        </div>
      </div>
      {message.userId!=userId && (
        <p className="senderName">{message.user.firstName}</p>
      )}
      <p>{message.content}</p>
    </div>
  );


  return (
    <Card.Body 
      id="message_list-container-content"
      style={{overflowY: 'scroll'}}>
      {listItems}
    </Card.Body>
  );
}

export default MessageListContent;