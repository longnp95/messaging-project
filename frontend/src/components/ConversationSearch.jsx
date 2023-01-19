const ConversationSearch = ({setSearchText}) => {
  const handleChange = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <input type="text" placeholder="Search" onChange={handleChange}></input>
  );
}

export default ConversationSearch;