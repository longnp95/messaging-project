import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import MenuIcon from '../assets/MenuIcon.png'
import GroupSearch from './GroupSearch';
import GroupListContent from './GroupListContent';

const cookie = new Cookies();
const GroupListContainer = (isCreating, setIsCreating,) => {
  const URL = 'https://localhost:8080/group';

  axios.post(URL, {
    token: cookie.get('token'),
    userId: cookie.get('userId')
  }).then((response)=>{
    if (response.error.status == 500) {
      return <p>{response.error.message}</p>;
    }
    const groups = response.data;

    return (
      <>
        <div id="group_list-container">
          <div id="group_list-container-topbar">
            <div id="group_list-container-topbar-icon-wrapper">
              <img src={MenuIcon} alt='Menu' width='30'/>
            </div>
            <GroupSearch />
          </div>

          <GroupListContent groups={groups} />
        </div>
      </>
    )
  }).catch((err)=>{
    return <p>{err}</p>;
  })
}

export default GroupListContainer;