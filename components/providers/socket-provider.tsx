"use client";

import { io as ClientIO } from 'socket.io-client';
import {createContext, useContext, useEffect} from "react";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
}

const socketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => {
  return useContext(socketContext);
}

import React from 'react';

const SocketProvider = (
  { children } : { children: React.ReactNode}
) => {
  const [socket, setSocket] = React.useState(null);
  const [isConnected, setConnected] = React.useState(false);

  useEffect(() => {
    console.log("[Socket.IO]" , process.env.NEXT_PUBLIC_SITE_URI!);
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URI!, {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on('connect', () => setConnected(true));
    socketInstance.on('disconnect', () => setConnected(false));

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  } , []);

  return (
    <socketContext.Provider value={{
      socket,
      isConnected
    }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;