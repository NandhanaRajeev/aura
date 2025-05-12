import { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navigation from "./Navigation/Nav";
import Recommended from "./Recommended/Recommended";
import Products from "./Products/Products";
import Card from "../../Components/FilterPages/Card";
import "./FilterPage.css";
import SERVER_URL from "../../config"; // Import SERVER_URL from config

const FilterPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // Add error state for UI feedback
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category = "", brand = "", color = "", price = "", searchQuery = "") => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state

    try {
      let url = `${SERVER_URL}/api/products/filter?`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (brand) url += `company=${encodeURIComponent(brand)}&`;
      if (color) url += `color=${encodeURIComponent(color)}&`;
      if (price) url += `price=${encodeURIComponent(price)}&`;
      if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}`;

      console.log("Fetching Products from URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Products:", data);

      // Validate data format
      if (!Array.isArray(data)) {
        throw new Error("Expected an array of products");
      }

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    fetchProducts(selectedCategory, selectedBrand, selectedColor, selectedPrice, value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("Filter Changed:", name, value);

    if (name === "category") {
      setSelectedCategory(value);
      fetchProducts(value, selectedBrand, selectedColor, selectedPrice, query);
    } else if (name === "brand") {
      setSelectedBrand(value);
      fetchProducts(selectedCategory, value, selectedColor, selectedPrice, query);
    } else if (name === "color") {
      setSelectedColor(value);
      fetchProducts(selectedCategory, selectedBrand, value, selectedPrice, query);
    } else if (name === "price") {
      setSelectedPrice(value);
      fetchProducts(selectedCategory, selectedBrand, selectedColor, value, query);
    }
  };

  function renderProducts(products) {
    if (!products || products.length === 0) {
      return <p>No products found.</p>;
    }
    return products.map(({ id, img, title, star, reviews, prev_price, new_price, company }) => (
      <Card
        key={id} // Use id for unique key
        id={id} // Pass id prop
        img={img}
        title={title}
        star={star}
        reviews={reviews}
        prevPrice={prev_price}
        newPrice={new_price}
        company={company}
      />
    ));
  }

  return (
    <div className="filter-page-container">
      <Sidebar handleChange={handleChange} />
      <div className="filter-page-content">
        <Navigation query={query} handleInputChange={handleInputChange} />
        <Recommended fetchProducts={fetchProducts} />
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <Products result={renderProducts(products)} />
        )}
      </div>
    </div>
  );
};

export default FilterPage;