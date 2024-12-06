import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Heatmap = ({ data, gym }) => {
    const svgRef = useRef();
    const tooltipRef = useRef(); 

    useEffect(() => {
        const margin = { top: 20, right: 900, bottom: 150, left: 150 };
        const width = 2300 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;

        const gymData = data.filter((d) => d.Gym === gym);

        const sports = ["Cardio", "Crossfit", "Pilates", "Swimming", "Weightlifting", "Yoga"];
        const times = gymData.map((d) => d.Time);

        // Flatten the data into { Time, Sport, Value } format
        const flatData = [];
        gymData.forEach((d) => {
            sports.forEach((sport) => {
                flatData.push({ Time: d.Time, Sport: sport, Value: d[sport] });
            });
        });

        const x = d3.scaleBand().domain(times).range([0, width]).padding(0.01);
        const y = d3.scaleBand().domain(sports).range([0, height]).padding(0.01);
        const color = d3
            .scaleSequential(d3.interpolateReds)
            .domain([0, d3.max(flatData, (d) => d.Value)]);

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.selectAll("*").remove();

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Axes
        g.append("g")
            .call(
                d3.axisBottom(x).tickValues(times.filter((_, i) => i % 60 === 0))
            )
            .attr("transform", `translate(0,${height})`)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)")
            .style("font-size", "15px");

        g.append("g")
            .call(d3.axisLeft(y).tickFormat(() => ""));

        g.selectAll("rect")
            .data(flatData)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.Time))
            .attr("y", (d) => y(d.Sport))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", (d) => color(d.Value))
            .on("mouseenter", (event, d) => {
                const tooltip = d3.select(tooltipRef.current);
                tooltip
                    .style("visibility", "visible")
                    .html(
                        `<div>Sport: <b>${d.Sport}</b></div>
                         <div>Time: <b>${d.Time}</b></div>
                         <div>Value: <b>${d.Value}</b></div>`
                    )
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 30}px`);
            })
            .on("mousemove", (event) => {
                d3.select(tooltipRef.current)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 30}px`);
            })
            .on("mouseleave", () => {
                d3.select(tooltipRef.current).style("visibility", "hidden");
            });

        const imageGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left - 100}, ${margin.top})`);

        const sportsImages = [
            { sport: "Cardio", image: "/images/cardio.png" },
            { sport: "Crossfit", image: "/images/crossfit.png" },
            { sport: "Pilates", image: "/images/pilates.png" },
            { sport: "Swimming", image: "/images/swimming.png" },
            { sport: "Weightlifting", image: "/images/weightlifting.png" },
            { sport: "Yoga", image: "/images/yoga.png" },
        ];

        sportsImages.forEach((item) => {
            const yPos = y(item.sport) + y.bandwidth() / 2 - 15;
            imageGroup
                .append("image")
                .attr("xlink:href", item.image)
                .attr("x", -10)
                .attr("y", yPos-15)
                .attr("width", 70)
                .attr("height", 70);
        });
    }, [data, gym]);

    return (
        <div style={{ position: "relative" }}>
            <svg ref={svgRef}></svg>
            {/* Tooltip */}
            <div
                ref={tooltipRef}
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    pointerEvents: "none",
                }}
            ></div>
        </div>
    );
};

export default Heatmap;
