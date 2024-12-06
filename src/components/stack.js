import React from 'react';
import * as d3 from 'd3';
import Xaxis from './Xaxis';
import Yaxis from './Yaxis';
import Bar from './Bar';

const margin = { top: 40, right: 20, bottom: 40, left: 100 };

const BarChart = ({ 
  data, 
  selectedType, 
  stackedData, 
  xScale, 
  yScale, 
  colorMapping, 
  handleMouseOver, 
  handleMouseOut, 
  handleTickMouseOver, 
  handleTickMouseOut, 
  highlightedGym, 
  setHighlightedGym // Add this prop
}) => {
  // Calculate inner width and height for the SVG chart
  const width = 500;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X and Y axis */}
        <Xaxis xScale={xScale} height={innerHeight} />
        <Yaxis
          yScale={yScale}
          onMouseOver={handleTickMouseOver}
          onMouseOut={handleTickMouseOut}
        />
        
        {/* Stacked bar layers */}
        {stackedData.map((layer, index) => (
          <g key={index} className="layer">
            {layer.map((barData, barIndex) => (
              <Bar
                key={barIndex}
                barData={barData}
                xScale={xScale}
                yScale={yScale}
                colorMapping={colorMapping}
                layerKey={layer.key}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                highlightedGym={highlightedGym} 
                setHighlightedGym={setHighlightedGym} // Pass setHighlightedGym to Bar
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
};

export default BarChart;
