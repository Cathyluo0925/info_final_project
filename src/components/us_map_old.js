import React, { useState } from "react";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";

export function USMap(props) {
    const { map, width, height, gymData, cityData } = props;
    const projection = geoAlbersUsa().scale(1200).translate([width / 2, height / 2.5]);
    const path = geoPath().projection(projection);
    const router = useRouter();

    const [tooltip, setTooltip] = useState({ visible: false, content: null, x: 0, y: 0 });

    const handleGymMouseEnter = (gym, event) => {
        const { pageX, pageY } = event;

        setTooltip({
            visible: true,
            content: {
                title: `Gym ${gym.gym_id.replace("gym_", "")}`,
                location: gym.location,
                type: gym.gym_type,
                facilities: gym.facilities,
            },
            x: pageX,
            y: pageY,
        });
    };

    const handleCityMouseEnter = (city, event) => {
        const { pageX, pageY } = event;
        setTooltip({
            visible: true,
            content: {
                title: city.City,
                totalUsers: city.Total_Num,
                proUsers: city.Num_Pro,
                basicUsers: city.Num_Basic,
                studentUsers: city.Num_Student,
            },
            x: pageX,
            y: pageY,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ visible: false, content: null, x: 0, y: 0 });
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
                    return (
                        <circle
                            key={`gym-${id}`}
                            cx={x}
                            cy={y}
                            r={12}
                            fill="#f9ee03"
                            onClick={() => router.push(`/gyms/${gym.gym_id}`)}
                            onMouseEnter={(event) => handleGymMouseEnter(gym, event)}
                            onMouseLeave={handleMouseLeave}
                        />
                    );
                })}

            {cityData &&
                cityData.map((city, id) => {
                    const [x, y] = projection([city.Longitude, city.Latitude]) || [0, 0];
                    return (
                        <circle
                            key={`city-${id}`}
                            cx={x}
                            cy={y}
                            r={city.Total_Num / 35}
                            fill="#2adff5"
                            onMouseEnter={(event) => handleCityMouseEnter(city, event)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <title>
                                {city.City} - Total Users: {city.Total_Num}
                            </title>
                        </circle>
                    );
                })}

            {tooltip.visible &&
                createPortal(
                    <div
                        style={{
                            position: "absolute",
                            left: tooltip.x + 10,
                            top: tooltip.y - 50,
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "13px",
                            borderRadius: "20px",
                            fontSize: "16px",
                            lineHeight: "1.5",
                            zIndex: 9999,
                            pointerEvents: "none", // Prevent tooltip from interfering with mouse events
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add subtle shadow for better contrast
                        }}
                    >
                        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                            {tooltip.content.title}
                        </div>
                        {tooltip.content.totalUsers !== undefined ? (
                            <>
                                <div>Total Users: {tooltip.content.totalUsers}</div>
                                <div>
                                    <span style={{ color: "#f98903", fontWeight: "bold" }}>
                                        Pro Users:
                                    </span>{" "}
                                    {tooltip.content.proUsers}
                                </div>
                                <div>
                                    <span style={{ color: "lightblue", fontWeight: "bold" }}>
                                        Basic Users:
                                    </span>{" "}
                                    {tooltip.content.basicUsers}
                                </div>
                                <div>
                                    <span style={{ color: "lightgreen", fontWeight: "bold" }}>
                                        Student Users:
                                    </span>{" "}
                                    {tooltip.content.studentUsers}
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>,
                    document.body // Attach tooltip to the body
                )}
        </g>
    );
}
