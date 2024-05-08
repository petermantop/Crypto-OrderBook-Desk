import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import io from "socket.io-client";
import { updateOrderBookWithNewOrder, updateOrderBookWithTrade } from "./utils";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, SOCKET_URL, setChartData }) => {
  const [identified, setIdentified] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
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

    // Connect to the socket server
    newSocket.connect();

    // Clean up on unmount
    return () => {
      newSocket.off("orderbook_new");
      newSocket.off("trade");
      newSocket.off("initial_map");
      newSocket.off("authenticated");
      newSocket.disconnect();
    };
  }, [SOCKET_URL, setChartData]);

  const value = {
    identified,
    setIdentified,
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
