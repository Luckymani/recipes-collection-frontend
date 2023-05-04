import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/catogory.css";
import RecipeCard from "./RecipeCard";

function Catogory() {
	const [catogoriesList, setCatogoriesList] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const type = searchParams.get("type");
	const value = searchParams.get("value");

	useEffect(() => {
		async function simple() {
			if (type && value) {
				await axios
					.post(`${process.env.REACT_APP_SERVER_ADDRESS}/catogory`, { type, value })
					.then((res) => {
						setCatogoriesList(res.data);
					})
					.catch((err) => {
						console.log(err.data.response.error);
					});
			} else if (type == "recomended") {
				await axios
					.post(`${process.env.REACT_APP_SERVER_ADDRESS}/catogory/getallrecomended`)
					.then((res) => {
						setCatogoriesList(res.data);
					})
					.catch((err) => {
						console.log(err.data.response.error);
					});
			} else if (type == "within15min") {
				await axios
					.post(`${process.env.REACT_APP_SERVER_ADDRESS}/catogory/getallwithin15min`)
					.then((res) => {
						setCatogoriesList(res.data);
					})
					.catch((err) => {
						console.log(err.data.response.error);
					});
			} else if (type == "wishlist") {
				await axios
					.post(`${process.env.REACT_APP_SERVER_ADDRESS}/catogory/wishlist`)
					.then((res) => {
						setCatogoriesList(res.data);
					})
					.catch((err) => {
						console.log(err.data.response.error);
					});
			}
		}
		simple();
	}, []);

	return (
		<section className="catogory" style={{ marginTop: "80px" }}>
			{type && value && (
				<div className="title">
					<h1>{value} items</h1>
				</div>
			)}

			{type == "recomended" && (
				<div className="title">
					<h1>recomended for you</h1>
				</div>
			)}

			{type == "within15min" && (
				<div className="title">
					<h1>within15min</h1>
				</div>
			)}
			{type == "wishlist" && (
				<div className="title">
					<h1>saved recipes</h1>
				</div>
			)}

			{catogoriesList && (
				<div className="catogory-recipes">
					{catogoriesList.map((recipe, index) => (
						<RecipeCard key={index} recipe={recipe} />
					))}
				</div>
			)}
		</section>
	);
}

export default Catogory;
