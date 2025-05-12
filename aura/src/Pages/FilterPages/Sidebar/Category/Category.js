import "./Category.css";
import { useEffect, useState } from "react";
import Input from '../../../../Components/FilterPages/Input';
import SERVER_URL from "../../../config";// ✅ Import server URL

function Category({ handleChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/categories`);
        const data = await response.json();
        console.log("Fetched Categories in Sidebar:", data); // Debugging line
        setCategories(data.map(category => category.trim())); // Ensure no extra spaces
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2 className="sidebar-title">Category</h2>

      <div>
        {/* 'All' option */}
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="category" />
          <span className="checkmark"></span>All
        </label>

        {/* Dynamically render categories from API */}
        {categories.map((category, index) => (
          <Input
            key={index}
            handleChange={handleChange}
            value={category}
            title={category}
            name="category"
          />
        ))}
      </div>
    </div>
  );
}

export default Category;
