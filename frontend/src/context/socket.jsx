import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import socketio from "socket.io-client";
import serverUrlConfig from '../configs/serverUrl.config';

export const socket = () => {
  const cookie = new Cookies();
  const token = cookie.get('token'); // get jwt token from local storage or cookie
  if (token) {
    return socketio(serverUrlConfig, {
      auth: {
        token: token
      }
    });
  }
  return socketio.connect(serverUrlConfig);
};

export const SocketContext = React.createContext();