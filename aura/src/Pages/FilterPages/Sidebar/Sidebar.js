import Category from "./Category/Category";
import Brands from "./Brands/Brands";
import Price from "./Price/Price";
import Colors from "./Colors/Colors";
import "./Sidebar.css";


const Sidebar = ({ handleChange }) => {
  return (
    <>
      <section className="sidebar">
        {/* <div className="logo-container">
          <h1>🛒</h1>
        </div> */}
        <div className="sidebar-header">
        <h2 className="sidebar-heading">Filters</h2> {/* Only heading */}
      </div>
        <Category handleChange={handleChange} />
        <Brands handleChange={handleChange}/>
        <Price handleChange={handleChange} />
        <Colors handleChange={handleChange} />
    
      </section>
    </>
  );
};

export default Sidebar;
