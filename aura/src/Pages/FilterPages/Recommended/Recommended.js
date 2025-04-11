import Button from '../../../Components/FilterPages/Button';
import { useEffect, useState } from "react";
import "./Recommended.css";

const Recommended = ({ fetchProducts }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories"); 
        const data = await response.json();
        console.log("Fetched Categories:", data); // Debugging line
        setCategories(data.map(category => category.trim())); // Ensure no extra spaces
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="recommended-title">Recommended</h2>
      <div className="recommended-flex">
        {/* Button for 'All Products' */}
        <Button onClickHandler={() => fetchProducts("")} value="" title="All Products" />
        
        {/* Dynamically render categories from API */}
        {categories.map((category, index) => (
          <Button 
            key={index} 
            onClickHandler={() => fetchProducts(category)} 
            value={category} 
            title={category} 
          />
        ))}
      </div>
    </div>
  );
};

export default Recommended;
