import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import MenuIcon from '../assets/MenuIcon.png'
import GroupSearch from './GroupSearch';
import GroupListContent from './GroupListContent';

const cookie = new Cookies();
const GroupListContainer = ({isCreating, setIsCreating, setMenuToggle, menuToggle}) => {
/*   const URL = 'https://localhost:8080/group';

  axios.post(URL, {
    token: cookie.get('token'),
    userId: cookie.get('userId')
  }).then((response)=>{
    if (response.error.status == 500) {
      return <p>{response.error.message}</p>;
    }
    const groups = response.data; */
    
    const groups = [
      {groupId:1, groupName:'asfdasdfsaf'},
      {groupId:2, groupName:'asdf'},
      {groupId:4, groupName:'asfdasfsadasdfsaf'},
      {groupId:5, groupName:'Long'},
    ]

    const menuOn = () => {
      setMenuToggle(true);
    }
    const [searchText, setSearchText] = useState('');
    return (
      <>
        <div id="group_list-container">
          <div id="group_list-container-topbar">
            <div id="group_list-container-topbar-icon-wrapper">
              <img src={MenuIcon} alt='Menu' width='30' onClick={menuOn}/>
            </div>
            <GroupSearch setSearchText={setSearchText}/>
          </div>
          <p>'{menuToggle}'</p>
          <p>{searchText}</p>
          <GroupListContent groups={groups} />
        </div>
      </>
    )
/*   }).catch((err)=>{
    return <p>{err}</p>;
  }) */
}

export default GroupListContainer;