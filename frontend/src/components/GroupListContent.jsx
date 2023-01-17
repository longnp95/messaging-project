const GroupListContent = ({groups}) => {
  const groupItems = groups.map((group) =>
    <p key={group.groupId}>
      {group.groupName}
    </p>
  );


  return (
    <div id="group_list-container-content">
      {groupItems}
    </div>
  );
}

export default GroupListContent;