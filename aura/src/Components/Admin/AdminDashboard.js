import React, { useEffect, useState } from "react";
import "./AdminDashboard.css"; // Ensure styling is correct for table

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Fetching the counts and latest products
    fetch("http://localhost:3000/api/admin-users/count")
      .then((res) => res.json())
      .then((data) => setUsersCount(data.count));

    fetch("http://localhost:3000/api/admin-products/count")
      .then((res) => res.json())
      .then((data) => setProductsCount(data.count));

    fetch("http://localhost:3000/api/admin-feedback/count")
      .then((res) => res.json())
      .then((data) => setFeedbackCount(data.count));

    fetch("http://localhost:3000/api/newsletter/count") // New API call for newsletter subscribers count
      .then((res) => res.json())
      .then((data) => setNewsletterCount(data.count));

    fetch("http://localhost:3000/api/products/latest")
      .then((res) => res.json())
      .then((data) => setLatestProducts(data.slice(0, 5))); // Get the latest 5 products
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats">
        <div className="cardadmin">
          <h3>Total Users</h3>
          <p>{usersCount}</p>
        </div>
        <div className="cardadmin">
          <h3>Total Feedbacks</h3>
          <p>{feedbackCount}</p>
        </div>
        <div className="cardadmin">
          <h3>Total Products</h3>
          <p>{productsCount}</p>
        </div>
        <div className="cardadmin">
          <h3>Total Newsletter Subscribers</h3>
          <p>{newsletterCount}</p>
        </div>
      </div>

 {/* Display Latest Products in a Table */}
      <div className="latest-products">
        <h3>Latest Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>Image</th>
              <th>Previous Price</th>
              <th>New Price</th>
            </tr>
          </thead>
          <tbody>
            {latestProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>
                  <img src={product.img} alt={product.title} width="50" height="50" />
                </td>
                <td>{product.prev_price}</td>
                <td>{product.new_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
