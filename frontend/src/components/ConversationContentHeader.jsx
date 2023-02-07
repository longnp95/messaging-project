import Blank_Avatar from '../public/Blank-Avatar.png'
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

const ConversationContentHeader = ({currentConversation}) => {
  return (
    <Card.Header id="conversation_content-header-wrapper" 
      className="d-flex justify-content-between align-items-center p-3 g-0 bg-info text-white"
      style={{ borderRadius: "0" }}
    >
        <i className="material-icons d-md-none">arrow_back</i>
        <Image 
          roundedCircle alt="Avatar" 
          src={currentConversation.avatar||Blank_Avatar} 
          style={{ width: "30px", height: "100%" }}
          className="d-none d-md-block"
        />
        <p className="mb-0 fw-bold">{currentConversation.name}</p>
        <i className="material-icons">more_vert</i>
    </Card.Header>
  )
}

export default ConversationContentHeader