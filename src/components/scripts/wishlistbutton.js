import React from "react";
import { FaPlus, FaList } from "react-icons/fa";
import "../styles/wishlistbutton.css"; // Import CSS file for styling

import { useNavigate } from "react-router-dom";
const Buttons = () => {
	const navigate = useNavigate();
	return (
		<div className="buttons-container">
			<button className="add-button" onClick={() => navigate("/addrecipe")}>
				<FaPlus className="button-icon" />
			</button>
			<button className="wishlist-button">
				<FaList className="button-icon" onClick={() => navigate("/catogory?type=wishlist")} />
			</button>
		</div>
	);
};

export default Buttons;
