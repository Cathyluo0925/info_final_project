import React, { useState } from "react";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { scaleSequential, interpolateYlGn } from "d3-scale"; // Add D3 color scale

export function USMap2(props) {
    const { map, width, height, gymData, customerColorScale, highlightedGym } = props;

    const projection = geoAlbersUsa().scale(1200).translate([width / 3, height / 2.25]);
    const path = geoPath().projection(projection);

    const [tooltip, setTooltip] = useState({ visible: false, content: null, x: 0, y: 0 });
    const [hoveredGym, setHoveredGym] = useState(null); // Track which gym is hovered

    const handleGymMouseEnter = (gym, event) => {
        console.log("Mouse enter:", event);
        if (hoveredGym === gym.gym_id) return; 
        const { pageX, pageY } = event;
    
        // Calculate tooltip position
        let tooltipX = pageX -150 ; // Adjust for the width of the tooltip
        let tooltipY = pageY + 20;  // Position slightly above the cursor
        //console.log (tooltipX)
        if (tooltipY > 650) {
            tooltipY = pageY + 5;  // Move the tooltip up if it's too far down
        }
        if (tooltipX < 0) {
            tooltipX = pageX - 100;  // Move the tooltip up if it's too far down
        }
    
        const gymNumber = gym.gym_id.replace("gym_", "Gym ");
        
        // Tooltip content with selected group labels
        const selectedGroups = gym.selectedLabels || "Total";  // Default to "Total" if no groups are selected
        const tooltipContent = {
            title: gymNumber,
            location: gym.location,
            type: gym.gym_type,
            facilities: gym.facilities,
            customers: gym.num_customers,
            selectedGroups: selectedGroups,  // Include selected groups in tooltip content
        };
    
        setTooltip({
            visible: true,
            content: tooltipContent,
            x: tooltipX,
            y: tooltipY,
        });

        // Set the hovered gym to highlight
        setHoveredGym(gym.gym_id);
    };
    
    const handleMouseLeave = () => {
        console.log("Mouse leave triggered"); // Debugging line
        setTooltip({ visible: false, content: null, x: 0, y: 0 });
        setHoveredGym(null); // Reset the hovered gym when mouse leaves
    };

    return (
        <g>
            {map.features &&
                map.features.map((feature, id) => (
                    <path
                        key={id}
                        d={path(feature)}
                        fill={"none"}
                        stroke={"#665E5C"}
                        strokeWidth={1}
                    />
                ))}

            {gymData &&
                gymData.map((gym, id) => {
                    const [x, y] = projection([gym.longitude, gym.latitude]) || [0, 0];
                    const color = customerColorScale(gym.num_customers); // Use the color scale based on customers

                    // Determine if this gym is hovered or highlighted
                    const isHovered = hoveredGym === gym.gym_id;
                    const isHighlighted = highlightedGym === gym.gym_id; // Check if this gym is highlighted
                    const circleStroke = isHovered ? "red" : "none"; // Change stroke to red if hovered

                    return (
                        <circle
                            key={id}
                            cx={x}
                            cy={y}
                            r={isHighlighted ? 24 :12}
                            fill={ color} // Highlight with red if selected
                            stroke={isHighlighted ? '#00d8ff' : circleStroke}
                            strokeWidth={6}
                            onMouseEnter={(event) => handleGymMouseEnter(gym, event)}
                            onMouseLeave={handleMouseLeave} 
                        />
                    );
                })}

            {tooltip.visible && (
                <foreignObject x={tooltip.x} y={tooltip.y} width={350} height={400}>
                    <div
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "13px",
                            borderRadius: "20px",
                            fontSize: "18px",
                            lineHeight: "1.5",
                            textAlign: "left", 
                            zIndex : 9999,// Ensure left-alignment
                        }}
                    >
                        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                            {tooltip.content.title}
                        </div>
                        <div>Location: {tooltip.content.location}</div>
                        <div>
                            Type:{" "}
                            <span
                                style={{
                                    color:
                                        tooltip.content.type === "Premium"
                                            ? "yellow"
                                            : tooltip.content.type === "Budget"
                                            ? "lightgreen"
                                            : "lightblue",
                                }}
                            >
                                {tooltip.content.type}
                            </span>
                        </div>
                        <div>Facilities: {tooltip.content.facilities}</div>
                        <div>Customers: {tooltip.content.customers}</div>
                        {/* Show selected groups in the tooltip */}
                        <div>Selected Groups: {tooltip.content.selectedGroups}</div>
                    </div>
                </foreignObject>
            )}
        </g>
    );
}
