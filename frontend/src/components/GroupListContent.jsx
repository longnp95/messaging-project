const GroupListContent = (groups) => {
  const groupItems = groups.map((group) =>
    <li key={group.groupId}>
      {group.groupName}
    </li>
  );


  return (
    <div id="group_list-container-content">
      {groupItems}
    </div>
  );
}

export default GroupListContent;