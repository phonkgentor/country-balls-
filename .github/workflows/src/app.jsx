import React, { useState } from "react";
import "./style.css";

function App() {
  const [country, setCountry] = useState("");
  const [info, setInfo] = useState("");

  const handleFetchInfo = async () => {
    if (!country) return alert("Please enter a country name.");
    // Example fetch from REST Countries API for demo:
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
      const data = await response.json();
      if (data && data[0]) {
        setInfo(
          `Country: ${data[0].name.common}\nCapital: ${data[0].capital ? data[0].capital[0] : "N/A"}\nRegion: ${data[0].region}`
        );
      } else {
        setInfo("Country info not found.");
      }
    } catch {
      setInfo("Error fetching country info.");
    }
  };

  return (
    <div className="app-container">
      <h1>Country Ball Info</h1>
      <input
        type="text"
        placeholder="Enter country name"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={handleFetchInfo}>Get Info</button>
      <pre className="info-box">{info}</pre>
    </div>
  );
}

export default App;
