import React from "react";
import geoData from "../../src/gz_2010_us_050_00_20m.json";
import { USMap } from "../components/us_map_old.js";
import { csv } from "d3";
import { useRouter } from 'next/router'; // Import useRouter from next/router

const csvUrl = "https://gist.githubusercontent.com/Luviayao/e4e85cd20112e7929bb01e2120d69c99/raw/04b743bff07c6e03774b147c279f7aa0d751bc0f/gym_location.csv";
const user_city_csvUrl = "https://gist.githubusercontent.com/Luviayao/d47c9d33e2ab681b5c8c12ce4c7fbe16/raw/693378b80a31372e5b3bc1b05a4692823b8e6394/user_data_city.csv";

function useData(csvPath) {
    const [dataAll, setData] = React.useState(null);

    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.longitude = +d.longitude;
                d.latitude = +d.latitude;
            });
            setData(data);
        });
    }, [csvPath]);

    return dataAll;
}

function useCityData(csvPath) {
    const [cityData, setCityData] = React.useState(null);

    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.Num_Pro = +d.Num_Pro; 
                d.Num_Basic = +d.Num_Basic; 
                d.Num_Student = +d.Num_Student; 
                d.Total_Num = +d.Total_Num; 
                d.Longitude = +d.Longitude; 
                d.Latitude = +d.Latitude; 
            });
            setCityData(data);
        });
    }, [csvPath]);

    return cityData;
}

function Geomap() {
    const SVG_WIDTH = 1040;  // Reduced width to fit in 65% of the page
    const SVG_HEIGHT = 1000;
    const gymData = useData(csvUrl); 
    const cityData = useCityData(user_city_csvUrl);

    const router = useRouter(); // Initialize useRouter hook

    const handleGoToCase2 = () => {
        router.push('/case2'); // Navigate to the homepage ("/")
    };

    if (!gymData || !cityData) return <div>Loading...</div>; 

    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "100vh" }}>
            {/* Main content section (map) */}
            <div style={{ width: "65%", paddingRight: "10px" }}>
                {/* Button to go to case2 */}
                <button 
                    onClick={handleGoToCase2} 
                    style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
                >
                    Click and see more information on age groups!
                </button>
                <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ border: "0px solid black" }}>
                    <USMap 
                        map={geoData} 
                        width={SVG_WIDTH} 
                        height={SVG_HEIGHT} 
                        gymData={gymData} 
                        cityData={cityData} 
                    />
                </svg>
            </div>

            {/* Empty div or a new component to occupy 35% space on the right */}
            <div style={{ width: "35%", background: "white" }}>
                {/* You can add your new bar chart or other content here */}
            </div>
        </div>
    );
}

export default Geomap;
