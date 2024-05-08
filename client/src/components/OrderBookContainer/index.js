import React from "react";
import { useTheme, Paper } from "@mui/material";
import OrderBookChart from "./OrderBookCharts";
import OrderBookTable from "./OrderBookTable";
import SelectCyptoPair from "./SelectCyptoPair";

const OrderBookContainer = ({ data }) => {
  const theme = useTheme();

  return (
    <>
      <SelectCyptoPair />
      <Paper elevation={3} style={{ borderRadius: theme.shape.borderRadius }}>
        <OrderBookChart data={data} />
        <OrderBookTable asks={data.asks} bids={data.bids} />
      </Paper>
    </>
  );
};

export default OrderBookContainer;
