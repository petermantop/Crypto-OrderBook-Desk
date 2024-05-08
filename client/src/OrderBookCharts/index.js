import React from "react";
import { Group } from "@visx/group";
import { AreaClosed, LinePath, Bar } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { PatternLines } from "@visx/pattern";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { max, min } from "d3-array";

const OrderBookChart = ({ width, height, margin, data }) => {
  const bids = data.bids.sort((a, b) => a.price - b.price);
  const asks = data.asks.sort((a, b) => a.price - b.price);

  const xScale = scaleLinear({
    range: [margin.left, width - margin.right],
    domain: [min(bids, (d) => d.price), max(asks, (d) => d.price)],
  });

  const yScale = scaleLinear({
    range: [height - margin.bottom, margin.top],
    domain: [0, max([...bids, ...asks], (d) => d.quantity)],
    nice: true,
  });

  // Accessors
  const x = (d) => xScale(d.price);
  const y = (d) => yScale(d.quantity);

  return (
    <svg width={width} height={height}>
      <LinearGradient
        id="bid-gradient"
        from="#95ffba"
        to="#4E756B"
        fromOpacity={0.6}
        toOpacity={0.1}
      />
      <LinearGradient
        id="ask-gradient"
        from="#c1796c"
        to="#785d5d"
        fromOpacity={0.6}
        toOpacity={0.1}
      />
      <PatternLines
        id="bid-pattern"
        height={6}
        width={6}
        stroke="#95ffba"
        strokeWidth={1}
        orientation={["diagonal"]}
      />
      <PatternLines
        id="ask-pattern"
        height={6}
        width={6}
        stroke="#c1796c"
        strokeWidth={1}
        orientation={["diagonal"]}
      />

      <Group>
        {/* Bids */}
        <AreaClosed
          data={bids}
          x={x}
          y={y}
          yScale={yScale}
          fill="url(#bid-gradient)"
          stroke="transparent"
        />
        <LinePath data={bids} x={x} y={y} stroke="#95ffba" strokeWidth={2} />
        {/* Asks */}
        <AreaClosed
          data={asks}
          x={x}
          y={y}
          yScale={yScale}
          fill="url(#ask-gradient)"
          stroke="transparent"
        />
        <LinePath data={asks} x={x} y={y} stroke="#c1796c" strokeWidth={2} />
        <Bar
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
          fill="url(#ask-pattern)"
          opacity={0.1}
        />
      </Group>

      {/* Axes */}
      <AxisLeft
        scale={yScale}
        left={margin.left}
        tickStroke="#333"
        stroke="#333"
      />
      <AxisBottom
        scale={xScale}
        top={height - margin.bottom}
        tickStroke="#333"
        stroke="#333"
      />
    </svg>
  );
};

export default OrderBookChart;
