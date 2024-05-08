import React, { createContext, useContext, useState, useEffect } from "react";
import { updateOrderBookWithNewOrder, updateOrderBookWithTrade } from "./utils";

import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, SOCKET_URL }) => {
  const [user, setUser] = useState({
    id: null,
    name: "",
  });
  const [orderbookData, setOrderbookData] = useState({
    market: "BTC/USDT",
    bids: [],
    asks: [],
  });

  const [identified, setIdentified] = useState(false);
  const [socket, setSocket] = useState(null);
  const [askForIdentification, setAskForIdentification] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { autoConnect: false });
    setSocket(newSocket);

    newSocket.on("orderbook_new", (message) => {
      setOrderbookData((data) => updateOrderBookWithNewOrder(data, message));
    });

    newSocket.on("trade", (message) => {
      setOrderbookData((data) => updateOrderBookWithTrade(data, message));
    });

    newSocket.on("initial_map", ({ bids, asks }) => {
      setOrderbookData((data) => ({ ...data, bids, asks }));
    });

    newSocket.on("identified", ({ token, user }) => {
      setIdentified(true);
      localStorage.setItem("token", token);
      setUser({ id: user.id, name: user.name });
    });

    newSocket.on("identify_now", () => {
      const token = localStorage.getItem("token");

      if (token) {
        // Validate the token with the server here if necessary
        newSocket.emit("validate_token", token);
      } else {
        setAskForIdentification(true);
      }
    });

    newSocket.on("token_validation_failed", () => {
      localStorage.removeItem("token");

      setAskForIdentification(true);
    });

    newSocket.connect();

    return () => {
      newSocket.off("orderbook_new");
      newSocket.off("trade");
      newSocket.off("initial_map");
      newSocket.off("identified");
      newSocket.off("identify_now");
      newSocket.disconnect();
    };
  }, [SOCKET_URL, setOrderbookData]);

  const onSignIn = () => {
    setAskForIdentification(true);
  };

  const onSignOut = () => {
    socket.emit("signout");

    localStorage.removeItem("token");
    setIdentified(false);
    setUser({});
  };

  const value = {
    socket,
    user,
    orderbookData,
    setOrderbookData,
    identified,
    setIdentified,
    askForIdentification,
    setAskForIdentification,
    onSignIn,
    onSignOut,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
