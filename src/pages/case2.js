import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { USMap2 } from "../components/forcase2.js";
import { csv } from "d3";
import { scaleSequential } from "d3-scale";
import { interpolateYlOrBr } from "d3-scale-chromatic";
import { max } from "d3-array";
import Select from "react-select";
import { useRouter } from 'next/router'; // Import useRouter from next/router
import DropdownButton from '../components/DropdownButton.js';
import BarChart from '../components/Bar_chart.js';
import geoData from "../gz_2010_us_050_00_20m.json";


// Custom Hook for loading data
function useData(csvPath) {
    const [dataAll, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        csv(csvPath)
            .then((data) => {
                data.forEach((d) => {
                    d.longitude = +d.longitude;
                    d.latitude = +d.latitude;
                    d.group1 = +d.group1;
                    d.group2 = +d.group2;
                    d.group3 = +d.group3;
                    d.group4 = +d.group4;
                    d.group5 = +d.group5;
                });
                setData(data);
            })
            .catch((err) => {
                console.error("Error loading CSV:", err);
                setError("Failed to load data.");
            });
    }, [csvPath]);

    return { data: dataAll, error };
}

//legend function
// Custom Legend Component
function Legend({ colorScale, width = 300, height = 20 }) {
    const gradientId = "color-gradient";

    return (
        <svg width={width} height={height}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={colorScale(0)} />
                    <stop offset="100%" stopColor={colorScale(1)} />
                </linearGradient>
            </defs>
            <rect width={width} height={height} fill={`url(#${gradientId})`} />
            <text x={0} y={height + 15} fontSize="12px" textAnchor="start">
                High
            </text>
            <text x={width - 40} y={height + 15} fontSize="12px" textAnchor="end">
                Low
            </text>
        </svg>
    );
}

// Main component
function Geomap() {
    const SVG_WIDTH = 1600;
    const SVG_HEIGHT = 1000;

    const { data: gymData, error: gymError } = useData(
        "https://gist.githubusercontent.com/Luviayao/e4e85cd20112e7929bb01e2120d69c99/raw/04b743bff07c6e03774b147c279f7aa0d751bc0f/gym_location.csv"
    );
    const { data: ageData, error: ageError } = useData(
        "https://gist.githubusercontent.com/Cathyluo0925/8aaa3fc0567d7d75d2b9f5b9b90396ce/raw/d6e5da724825ffa95812e519b48e20ef7ea2b417/gistfile1.csv"
    );
    const { data: barData, error: barError } = useData(
        "https://gist.githubusercontent.com/Cathyluo0925/8aaa3fc0567d7d75d2b9f5b9b90396ce/raw/922ed8b1caa7d2d7945b57b8c4a2038df11c8c60/gistfile2.csv"
    );

    const router = useRouter();
    const [selectedGroups, setSelectedGroups] = useState([{ value: "total", label: "Total" }]);
    const [highlightedGym, setHighlightedGym] = useState(null); // Declare state for highlighted gym
    const [selectedType, setSelectedType] = useState("pro");

    const customerColorScalelegend = d3.scaleSequential(d3.interpolateReds).domain([4000, 5000]); // Adjust the domain as per your data range


    const handleGroupChange = (selectedOptions) => {
        const isTotalSelected = selectedOptions.some((option) => option.value === "total");
        if (isTotalSelected) {
            setSelectedGroups([{ value: "total", label: "Total" }]);
        } else {
            setSelectedGroups(selectedOptions || []);
        }
    };

    const handleDropdownChange = (selectedOption) => {
        setSelectedType(selectedOption.value);
    };

    const handleGoToHomepage = () => {
        router.push("/");
    };

    if (!gymData || !ageData || !barData) {
        if (gymError || ageError || barError) {
            return <div>Error loading data</div>;
        }
        return <div>Loading...</div>;
    }

    const enhancedAgeData = ageData.map((entry) => ({
        ...entry,
        total: entry.group1 + entry.group2 + entry.group3 + entry.group4 + entry.group5,
    }));

    const enhancedGymData = gymData.map((gym) => {
        const ageEntry = enhancedAgeData.find((age) => age.gym_id === gym.gym_id);

        let totalSelectedCustomers = 0;
        const selectedLabels = selectedGroups.map((group) => {
            const groupKey = group.value;
            totalSelectedCustomers += ageEntry ? ageEntry[groupKey] : 0;
            return group.label;
        });

        return {
            ...gym,
            num_customers: totalSelectedCustomers,
            selectedLabels: selectedLabels.join(", "),
        };
    });

    const customerColorScale = scaleSequential(interpolateYlOrBr).domain([
        0,
        max(enhancedGymData, (d) => d.num_customers),
    ]);

   // console.log(customerColorScale)

    const groupOptions = [
        { value: "total", label: "Total" },
        { value: "group1", label: "Age 18-29" },
        { value: "group2", label: "Age 30-39" },
        { value: "group3", label: "Age 40-49" },
        { value: "group4", label: "Age 50-59" },
        { value: "group5", label: "Age 60-69" },
    ];

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            
            {/* Left section: Map and dropdown */}
            <div style={{ width: "65%", textAlign: "center", position: "relative" }}>
                <button
                    onClick={handleGoToHomepage}
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        zIndex: 1,
                    }}
                >
                    Go to homepage
                </button>

                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "50%",                // Align to the center horizontally
                        transform: "translateX(-50%)", // Adjust to truly center it by offsetting half of its width
                        width: "600px",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column", // Align items in a column (vertical stacking)
                        alignItems: "center",
                     }}
                >
                    <label htmlFor="group-select" 
                    style={{ fontWeight: "bold",
                        display: "block",
                        textAlign: "center",
                        fontSize: "25px",  // Increase the font size of the label
                        marginBottom: "20px",
                         }}>
                        Select Age Groups:<br />
                    </label>
                    <Select
                        id="group-select"
                        options={groupOptions}
                        isMulti
                        value={selectedGroups}
                        onChange={handleGroupChange}
                        placeholder="Select groups..."
                        styles={{
                            control: (base) => ({
                                ...base,
                                fontSize: "16px",
                            }),
                        }}
                    />
                </div>
                {/*<div style={{ marginTop: "40px" }}>
                    <Legend colorScale={customerColorScalelegend} />
                </div>*/}

                <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ border: "1px solid black" }}>
                    <USMap2
                        map={geoData}
                        width={SVG_WIDTH}
                        height={SVG_HEIGHT}
                        gymData={enhancedGymData}
                        customerColorScale={customerColorScale}
                        hoverLabel={(gym) => gym.selectedLabels}
                        highlightedGym={highlightedGym}
                        setHighlightedGym={setHighlightedGym}
                    />
                </svg>
            </div>

            {/* Right section: Horizontal Stacked Bar Chart */}
<div style={{ width: "35%", position: "relative", zIndex: 2 }}>
    <h2>Choose Subscription Type: {selectedType}</h2>
    
    {/* lengend */}
    <div style={{
        position: "absolute", // 绝对定位
        top: "20px",          // 距离顶部 10px
        right: "10px",   
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        marginBottom: "10px",
        marginRight: "20px",
    }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#2a5599", marginRight: "10px" }}></div>
            <span style={{ fontSize: "14px" }}>Pro</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#ffcc00", marginRight: "10px" }}></div>
            <span style={{ fontSize: "14px" }}>Basic</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#4caf50", marginRight: "10px" }}></div>
            <span style={{ fontSize: "14px" }}>Student</span>
        </div>
    </div>

    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <DropdownButton
            selectedType={selectedType}
            handleDropdownChange={handleDropdownChange}
        />
    </div>

    <BarChart
        data={barData}
        selectedType={selectedType}
        highlightedGym={highlightedGym}
        setHighlightedGym={setHighlightedGym}
    />
</div>

            
        </div>
    );
}

export default Geomap;
