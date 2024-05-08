import React, { useState } from "react";
import {
  Container,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";
import { SocketProvider, useSocket } from "./SocketContext"; // Updated import for SocketContext

import OrderBookChart from "./OrderBookCharts";
import OrderBookTable from "./OrderBookTable";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:4000";

const IdentificationDialog = () => {
  const { identified, setIdentified, socket } = useSocket();
  const [name, setName] = useState("");

  const handleIdentification = () => {
    socket.emit("identify", name);
  };

  return (
    <Dialog open={!identified} onClose={() => {}}>
      <DialogTitle>Identify Yourself</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to crypto pairs, please enter your name.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIdentified(true)}>Cancel</Button>
        <Button onClick={handleIdentification}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

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
