// Components/Admin/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="admin-landing-container">
            {/* <h1>Welcome to the Admin Dashboard</h1>
            <p>Select an option to manage the system.</p> */}
            <div className="admin-links">
                <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
                <Link to="/admin/stats" className="btn btn-primary">View Stats</Link>
                <Link to="/admin/settings" className="btn btn-primary">Settings</Link>
            </div>
        </div>
    );
}

export default LandingPage;
