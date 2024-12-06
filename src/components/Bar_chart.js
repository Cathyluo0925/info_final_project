// FinalChart.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import BarChart from './stack'; // Assuming this is the correct import for BarChart

const FinalChart = ({ data, selectedType, highlightedGym, setHighlightedGym }) => {
  const svgRef = useRef();

  const [stackedData, setStackedData] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
//   const [highlightedGym, setHighlightedGym] = useState(null); // Track highlighted gym_id

  const colorMapping = {
    pro: "#2a5599",    // Blue for pro
    basic: "#ffcc00",  // Yellow for basic
    student: "#4caf50" // Green for student
  };

  useEffect(() => {
    if (!data) return;

    const keys = ["pro", "student", "basic"];
    const reorderedKeys = [selectedType, ...keys.filter((key) => key !== selectedType)];
    setStackedData(d3.stack().keys(reorderedKeys)(data));
  }, [data, selectedType]);

  const width = 500;
  const height = 500;
  const margin = { top: 40, right: 20, bottom: 40, left: 100 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData.flat(), (d) => d[1])]) // Flatten the stackedData and get the max value
    .nice()
    .range([0, innerWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map((d) => d.gym_id))
    .range([0, innerHeight])
    .padding(0.1);

  // Handle mouseover and mouseout events to show/hide tooltip
  const handleMouseOver = (barData, event) => {
    let tooltipX = event.pageX + 50; // Adjust for the width of the tooltip
    const tooltipY = event.pageY - 50; // Tooltip offset from the mouse on the Y-axis (increased for more visibility)
    
    // console.log("event:", event);
    setTooltip({
      visible: true,
      content: `Number of subscribers:${barData[1] - barData[0]}`, // Display value only
      x: tooltipX, // Move tooltip to the right of the mouse
      y: tooltipY, // Move tooltip slightly down from the mouse
    });
  };

  const handleMouseOut = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  // Handle tick mouse over event to highlight the corresponding bar
  const handleTickMouseOver = (gym_id) => {
    setHighlightedGym(gym_id); // Set the highlighted gym_id when a tick is hovered over
  };

  const handleTickMouseOut = () => {
    setHighlightedGym(null); // Reset highlighted gym_id when mouse leaves the tick
  };

  return (
    <div>
      {/* Render the BarChart component and pass the necessary props */}
      <BarChart
        data={data}
        selectedType={selectedType}
        stackedData={stackedData}
        xScale={xScale}
        yScale={yScale}
        colorMapping={colorMapping}
        handleMouseOver={handleMouseOver}
        handleMouseOut={handleMouseOut}
        handleTickMouseOver={handleTickMouseOver}
        handleTickMouseOut={handleTickMouseOut}
        highlightedGym={highlightedGym}
        setHighlightedGym={setHighlightedGym}
      />
      {console.log("tooltip:", `${tooltip.x}`)}

      {tooltip.visible && (
  <foreignObject x={tooltip.x} y={tooltip.y} width={150} height={50}>
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '8px',  // Rounded corners for a softer look
    padding: '10px',
    fontSize: '14px',      // Slightly larger font for readability
    pointerEvents: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',  // Center text horizontally
    justifyContent: 'center',  // Center text vertically
    opacity: '0.9',         // Slight transparency for a more modern look
  }}>
    <div style={{
      fontWeight: "bold",
      color: '#333',  // Dark text for better contrast
      marginBottom: '8px',  // Slight space below the title
      fontSize: '16px',  // Larger font size for the title
      textAlign: 'center',  // Ensure the title is centered
    }}>
      {tooltip.content}
    </div>
  </div>
</foreignObject>

)}

    
    </div>
  );
};

export default FinalChart;
