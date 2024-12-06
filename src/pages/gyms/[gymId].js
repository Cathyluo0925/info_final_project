import React from "react";
import Heatmap from "../../components/heatmap.js";
import { useRouter } from "next/router";
import * as d3 from "d3";

const csvUrl = "https://gist.githubusercontent.com/Luviayao/310ede55c68358af5323b8220babb97a/raw/gym_all.csv";

function useData(csvPath) {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        d3.csv(csvPath).then(loadedData => {
            setData(loadedData.map(d => ({
                Gym: d.Gym,
                Time: d.Time,
                Cardio: +d.Cardio,
                Crossfit: +d.Crossfit,
                Pilates: +d.Pilates,
                Swimming: +d.Swimming,
                Weightlifting: +d.Weightlifting,
                Yoga: +d.Yoga,
            })));
        });
    }, [csvPath]);

    return data;
}

const HeatmapPage = ({ gymId }) => {
    const router = useRouter(); // Access Next.js router
    const data = useData(csvUrl);

    if (!data) return <div>Loading...</div>;

    const gymTitle = `User Density Graph for ${gymId.replace("_", " ")}:`;
    const heatmapData = data.filter(d => d.Gym === gymId);

    return (
        <div>
            <button
                style={{
                    margin: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "20px"
                }}
                onClick={() => router.push("/")}
            >
                Back to Homepage
            </button>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{gymTitle}</h1>
            <Heatmap data={heatmapData} gym={gymId} />
        </div>
    );
};

export async function getServerSideProps(context) {
    const { gymId } = context.params;
    return { props: { gymId } };
}

export default HeatmapPage;
