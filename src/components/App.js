import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Geomap from "./components/Geomap"; // Geomap component
import Case2 from "./components/Case2";   // Case2 component, create it if not already

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/homepage" element={<Geomap />} />
        <Route path="/case2" element={<Case2 />} />
        {/* Add more routes if needed */}
      </Routes>
    </Router>
  );
}

export default App;
