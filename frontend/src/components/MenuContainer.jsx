const MenuContainer = ({menuToggle, setCreateType, setCreateTypeId, createTypeId, setIsCreating}) => {
  return (
    <div id="menu-container" className={"col-md-4 "+{menuToggle}}>
      <div id="menu-container-user">
        <span>Current user</span>
      </div>
      <div id="menu-container-create_group">
        <span>Create Group</span>
      </div>
      <div id="menu-container-direct_message">
        <span>Direct Message</span>
      </div>
      <div id="menu-container-logout">
        <span>Logout</span>
      </div>
    </div>
  )
}

export default MenuContainer;