import axios from "axios";

const NewConversationForm = ({user, setIsCreating, createType, createTypeId}) => {
  const initialForm = {
    conversationName: "",
    conversationAvatarUrl: "",
    typeConversation: 2
  }
  
  const [form,setForm] = useState(initialForm)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('/conversation/create', {
      conversationName: form.conversationName,
      conversationAvatarUrl: form.conversationAvatarUrl,
      typeConversation: form.typeConversation
    });
    if (response.data.error.status == 500) {
      alert(response.data.error.message);
      return;
    }
    console.log(response.data.data);
    setIsCreating(false);
  }

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value})
  }
  
  return (
    <div id="conversation_form-container">
      <p>{`New `}</p>
    </div>
  )
}