const GroupSearch = ({setSearchText}) => {
  const handleChange = (e) => {
    setSearchText(e.target.value);
  }

  return (
    <div id='group_list-container-topbar-search-wrapper'>
      <input type="search" placeholder="Search" onChange={handleChange}></input>
    </div>
  );
}

export default GroupSearch;