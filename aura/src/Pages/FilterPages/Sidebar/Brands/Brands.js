import "./Brands.css";
import { useEffect, useState } from "react";
import Input from '../../../../Components/FilterPages/Input';



function Brands({ handleChange }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/brands");
        const data = await response.json();
        console.log("Fetched Brands:", data); // Debugging line

        // Remove duplicates and trim spaces
        setBrands(data.map(brand => brand.trim()));
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div>
      <h2 className="sidebar-title">Brands</h2>

      <div>
        {/* Radio button for 'All' brands */}
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="brand" />
          <span className="checkmark"></span> All
        </label>

        {/* Dynamically render brands */}
        {brands.map((company, index) => (
          <Input key={index} 
          handleChange={handleChange} 
          value={company} title={company} 
          name="brand" />
        ))}
      </div>
    </div>
  );
}

export default Brands;
