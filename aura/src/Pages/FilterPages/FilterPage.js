import { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navigation from "./Navigation/Nav";
import Recommended from "./Recommended/Recommended";
import Products from "./Products/Products";
import Card from "../../Components/FilterPages/Card";
import "./FilterPage.css"; // Import the new CSS

const FilterPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category = "", brand = "", color = "", price = "", searchQuery = "") => {
    try {
      let url = `http://localhost:3000/api/products/filter?`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (brand) url += `company=${encodeURIComponent(brand)}&`;
      if (color) url += `color=${encodeURIComponent(color)}&`;
      if (price) url += `price=${encodeURIComponent(price)}&`;
      if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}`;

      console.log("Fetching Products from URL:", url);

      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched Products:", data);

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    return products.map(({ img, title, star, reviews, prev_price, new_price, company }) => (
      <Card
        key={title}
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
        <Products result={renderProducts(products)} />
      </div>
    </div>
  );
};

export default FilterPage;
