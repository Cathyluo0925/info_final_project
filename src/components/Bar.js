import React from 'react';

const Bar = ({ barData, xScale, yScale, colorMapping, layerKey, onMouseOver, onMouseOut, highlightedGym }) => {
  const { gym_id, key } = barData.data; // Extract gym_id and key from barData
  const height = yScale.bandwidth();
  const barWidth = xScale(barData[1]) - xScale(barData[0]);

  // Default color if layerKey is not found in colorMapping
  const barColor = colorMapping[layerKey] || "#000";  // fallback to black if no color is found
  
  // Check if the current gym_id is highlighted
  const isHighlighted = highlightedGym === gym_id;

  return (
    <rect
      x={xScale(barData[0])}
      y={yScale(gym_id)}
      width={barWidth}
      height={height}
      fill={barColor}
      stroke={isHighlighted ? 'red' : 'none'}  // Add stroke color based on highlighted status
      strokeWidth={isHighlighted ? 3 : 0}    // Set stroke width when highlighted
      onMouseOver={(e) => {
        onMouseOver(barData, e);  // Pass the event and barData to the parent component
      }}
      onMouseOut={() => {
        onMouseOut();  // Trigger mouseOut to hide the tooltip
      }}
    />
  );
};

export default Bar;
