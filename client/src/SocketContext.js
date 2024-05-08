import React, { createContext, useContext, useState, useEffect } from "react";
import { updateOrderBookWithNewOrder, updateOrderBookWithTrade } from "./utils";

import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, SOCKET_URL, setChartData }) => {
  const [identified, setIdentified] = useState(false);
  const [socket, setSocket] = useState(null);
  const [askForIdentification, setAskForIdentification] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { autoConnect: false });
    setSocket(newSocket);

    newSocket.on("orderbook_new", (message) => {
      setChartData((data) => updateOrderBookWithNewOrder(data, message));
    });

    newSocket.on("trade", (message) => {
      setChartData((data) => updateOrderBookWithTrade(data, message));
    });

    newSocket.on("initial_map", ({ bids, asks }) => {
      setChartData((data) => ({ ...data, bids, asks }));
    });

    newSocket.on("authenticated", () => {
      setIdentified(true);
    });

    newSocket.on("identify_now", () => {
      setAskForIdentification(true);
    });

    newSocket.connect();

    return () => {
      newSocket.off("orderbook_new");
      newSocket.off("trade");
      newSocket.off("initial_map");
      newSocket.off("authenticated");
      newSocket.off("identify_now");
      newSocket.disconnect();
    };
  }, [SOCKET_URL, setChartData]);

  const value = {
    identified,
    setIdentified,
    socket,
    askForIdentification,
    setAskForIdentification,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
