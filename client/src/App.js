import React, { useState } from "react";
import { Container, useTheme, Paper } from "@mui/material";
import { SocketProvider } from "./SocketContext";
import IdentificationDialog from "./UserDialog";
import OrderBookChart from "./OrderBookCharts";
import OrderBookTable from "./OrderBookTable";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:4000";

const App = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    market: "BTC/USDT",
    bids: [],
    asks: [],
  });

  return (
    <SocketProvider SOCKET_URL={SOCKET_URL} setChartData={setChartData}>
      <IdentificationDialog />
      <Container sx={{ p: 2 }}>
        <Paper elevation={3} style={{ borderRadius: theme.shape.borderRadius }}>
          <OrderBookChart data={chartData} />
          <OrderBookTable asks={chartData.asks} bids={chartData.bids} />
        </Paper>
      </Container>
    </SocketProvider>
  );
};

export default App;
