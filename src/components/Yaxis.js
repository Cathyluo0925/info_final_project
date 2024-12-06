import React from 'react';

const Yaxis = ({ yScale, onMouseOver, onMouseOut }) => {
  return (
    <g className="y-axis">
      {yScale.domain().map((gym_id) => (
        <text
          key={gym_id}
          y={yScale(gym_id) + yScale.bandwidth() / 2} // Adjust text position
          x={-10} // Position text slightly left
          dy=".35em"
          textAnchor="end"
          onMouseOver={() => onMouseOver(gym_id)} // Call handler with gym_id
          onMouseOut={onMouseOut} // Reset on mouse out
          style={{ cursor: 'pointer' }}
        >
          {gym_id}
        </text>
      ))}
    </g>
  );
};

export default Yaxis;
