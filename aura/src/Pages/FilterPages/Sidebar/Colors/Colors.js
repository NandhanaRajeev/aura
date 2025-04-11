import "./Colors.css";
import Input from '../../../../Components/FilterPages/Input';

import { useEffect, useState } from "react";

const Colors = ({ handleChange }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/colors");
        const data = await response.json();
        
        console.log("🎨 Fetched Colors from API:", data); // ✅ Debugging log

        if (Array.isArray(data) && data.length > 0) {
          setColors(data.filter(color => color && color.trim() !== "").map(color => color.trim())); // ✅ Remove empty values & trim spaces
        } else {
          console.warn("⚠️ No valid colors found:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  return (
    <div>
      <h2 className="sidebar-title color-title">Colors</h2>

      {/* 'All' option */}
      <label className="sidebar-label-container">
        <input onChange={handleChange} type="radio" value="" name="color" />
        <span className="checkmark all"></span>
        All
      </label>

      {/* Dynamically render colors */}
      {colors.length > 0 ? (
        colors.map((color, index) => (
          <Input key={index} handleChange={handleChange} value={color} title={color} name="color" />
        ))
      ) : (
        <p className="no-colors">No colors available</p> // ✅ Handle empty state
      )}
    </div>
  );
};

export default Colors;
