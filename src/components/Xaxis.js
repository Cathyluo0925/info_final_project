import React from 'react';
import * as d3 from 'd3';

const Xaxis = ({ xScale, height }) => {
  return (
    <g transform={`translate(0,${height})`}>
      <g ref={node => d3.select(node).call(d3.axisBottom(xScale))} />
    </g>
  );
};

export default Xaxis;
