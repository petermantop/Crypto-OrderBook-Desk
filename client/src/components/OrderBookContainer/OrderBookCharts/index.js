import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/material";
import { max } from "d3-array";

const OrderBookChart = ({ data }) => {
  const theme = useTheme();

  const bids = data.bids.sort((a, b) => a.price - b.price);
  const asks = data.asks.sort((a, b) => a.price - b.price);

  const combinedData = bids
    .map((bid) => ({ price: bid.price, bid: bid.quantity }))
    .concat(asks.map((ask) => ({ price: ask.price, ask: ask.quantity })));

  const maxQuantity = max([...bids, ...asks], (d) => d.quantity);

  return (
    <ResponsiveContainer height={300}>
      <AreaChart
        data={combinedData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.success.main}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.success.main}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={theme.palette.error.main}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={theme.palette.error.main}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="price"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: theme.palette.text.secondary,
            fontSize: theme.typography.caption.fontSize,
          }}
        />
        <YAxis
          domain={[0, maxQuantity]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: theme.palette.text.secondary,
            fontSize: theme.typography.caption.fontSize,
          }}
        />
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
          }}
          itemStyle={{ color: theme.palette.text.primary }}
          cursor={{ stroke: theme.palette.primary.main, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="bid"
          stroke={theme.palette.success.main}
          fillOpacity={1}
          fill="url(#bidGradient)"
        />
        <Area
          type="monotone"
          dataKey="ask"
          stroke={theme.palette.error.main}
          fillOpacity={1}
          fill="url(#askGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default OrderBookChart;
