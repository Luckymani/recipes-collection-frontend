import React from "react";
import "../styles/PageNotFound.css"; // Import the CSS file for PageNotFound component
import { useNavigate } from "react-router-dom";
const PageNotFound = () => {
	const navigate = useNavigate();

	const handleContactClick = () => {
		window.location.href = "mailto:msmanikanta25@gmail.com";
	};

	return (
		<div className="page-not-found">
			<h1 className="error-title">404 Error: Page Not Found</h1>
			<p className="error-message">The page you are looking for does not exist.</p>
			<p>Please check the URL for any typos or go back to the</p>
			<div className="buttons">
				<button onClick={() => navigate("/")} className="error-button">
					Home
				</button>
				<span> or </span>
				<button onClick={() => navigate("/recipes")} className="error-button">
					Recipes
				</button>
			</div>
			<p>If you believe this is a mistake,</p>
			<button className="error-button" onClick={handleContactClick}>
				contact us
			</button>{" "}
		</div>
	);
};

export default PageNotFound;
