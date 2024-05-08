import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import OrderBookChart from "./OrderBookCharts";
import OrderBookTable from "./OrderBookTable";

import { asks, bids } from "./data/orderBook";
import { updateOrderBookWithNewOrder, updateOrderBookWithTrade } from "./utils";

import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

// storing socket connection in this global variable
let socket = null;

function App() {
  const [chartData, setchartData] = useState({
    market: "BTC/USDT",
    bids: [],
    asks: [],
  });

  // after component mount...
  useEffect(() => {
    console.log("Connecting to socket...");
    socket = io("ws://localhost:4000");

    const handleNewOrderbook = (message) => {
      setchartData((chartData) => {
        const data = updateOrderBookWithNewOrder(chartData, message);
        return data;
      });
    };

    const handleNewTrade = (message) => {
      setchartData((chartData) => {
        const data = updateOrderBookWithTrade(chartData, message);
        return data;
      });
    };

    const initMap = ({ bids, asks }) => {
      setchartData((data) => ({ ...data, bids, asks }));
    };

    socket.on("orderbook_new", handleNewOrderbook);
    socket.on("trade", handleNewTrade);
    socket.on("initial_map", initMap);

    // Clean up on component unmount
    return () => {
      socket.off("orderbook_new", handleNewOrderbook);
      socket.off("trade", handleNewTrade);
      socket.close();
      console.log("Disconnected socket and cleanup done!");
    };
  }, []); // Ensure this only runs once

  return (
    <div>
      <div className="container">
        <div className="text-center">
          <OrderBookChart
            width={1024}
            height={400}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            data={chartData}
          />
        </div>
        <OrderBookTable asks={chartData.asks} bids={chartData.bids} />
      </div>
    </div>
  );
}

export default App;
