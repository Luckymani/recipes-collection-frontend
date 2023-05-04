import React, { useContext, useEffect, useState } from "react";
import "../styles/ReadRecipe.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegComment, FaTrash, FaSave, FaRegHeart } from "react-icons/fa"; // Import icons from react-icons
import { BsCartX } from "react-icons/bs";
import axios from "axios";

import { notificationContext } from "../../App";

function ReadRecipe() {
	const [recipe, setRecipe] = useState();
	const setNotificationDeatils = useContext(notificationContext);

	const navigate = useNavigate();
	const { id } = useParams();

	const [changed, setChanged] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [isWishList, setIsWishList] = useState(false);

	useEffect(() => {
		async function getrecipe() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/readrecipe`, { id })
				.then((res) => {
					setRecipe(res.data);
				})
				.catch((err) => {
					console.log(err.response.data.error);
					navigate("/pagenotfound");
					setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
				});
		}
		getrecipe();
	}, []);

	useEffect(() => {
		async function getInfo() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/gatherinfo`, { id: recipe._id })
				.then((res) => {
					setIsLiked(res.data.isLiked);
					setIsWishList(res.data.isWishList);
				})
				.catch((err) => {
					console.log(err.response.data.error);
					setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
				});
		}
		getInfo();
	});

	async function likefun(id, sameUser) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/like`, { id })
			.then((res) => {
				recipe.likes = recipe.likes + 1;
			})
			.catch((err) => {
				console.log(err.response.data.error);
				setNotificationDeatils({ showNotification: true, type: "error", message: err.response.data.error });
			});
	}
	async function disLikefun(id) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/dislike`, { id })
			.then((res) => {
				recipe.likes = recipe.likes - 1;
			})
			.catch((err) => {
				console.log(err.response.data.error);
				setNotificationDeatils({ showNotification: true, type: "error", message: err.response.data.error });
			});
	}
	async function addToWishList(id) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/addtowishlist`, { id })
			.then((res) => {
				setNotificationDeatils({ showNotification: true, type: "success", message: "recipe added to wishList" });
			})
			.catch((err) => {
				console.log(err.response.data.error);
				setNotificationDeatils({ showNotification: true, type: "error", message: err.response.data.error });
			});
	}
	async function removeFromWishList(id) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/removefromwishlist`, { id })
			.then((res) => {
				setChanged(changed + 1);
				setNotificationDeatils({ showNotification: true, type: "success", message: "recipe removed from wishList" });
			})
			.catch((err) => {
				console.log(err.response.data.error);
				setNotificationDeatils({ showNotification: true, type: "error", message: err.response.data.error });
			});
	}

	return (
		<>
			{recipe && (
				<div className="read-recipe-container">
					<div className="recipe-media-wrapper">
						<div className="recipe-image">
							<img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${recipe.imageFile}`} alt="recipe-image" />
						</div>

						{recipe.videoFile.length > 1 && (
							<div className="recipe-video">
								<video src={`${process.env.REACT_APP_SERVER_ADDRESS}/videos/${recipe.videoFile}`} alt="recipe-video" />
							</div>
						)}
					</div>
					<div className="recipe-info-wrapper">
						<h2>{recipe.name}</h2>
						<h4>By {recipe.author}</h4>
						<span>
							<div>servings:{" " + recipe.servings}</div>
							<div>duration:{" " + recipe.duration} min</div>
						</span>
					</div>
					<div className="icons-container-wrapper">
						{isLiked ? (
							<div className="icon-container" onClick={() => disLikefun(recipe._id)}>
								<FaHeart className="icon" />
								<span className="icon-label">{recipe.likes}</span>
							</div>
						) : (
							<div className="icon-container" onClick={() => likefun(recipe._id)}>
								<FaRegHeart className="icon" />
								<span className="icon-label">{recipe.likes}</span>
							</div>
						)}

						<div className="icon-container">
							<FaRegComment className="icon" />
							<span className="icon-label">{10}</span>
						</div>

						{isWishList ? (
							<div className="icon-container" onClick={() => removeFromWishList(recipe._id)}>
								<BsCartX className="icon" />
							</div>
						) : (
							<div className="icon-container" onClick={() => addToWishList(recipe._id)}>
								<FaSave className="icon" />
							</div>
						)}
					</div>

					<div className="recipe-deatils-wrapper">
						<label className="item item1">
							<h3>description:</h3>
							<div className="deatils description" dangerouslySetInnerHTML={{ __html: recipe.aboutRecipe }}></div>
						</label>
						<label className="item item2">
							<h3>process:</h3>
							<div className="deatils process" dangerouslySetInnerHTML={{ __html: recipe.preparation }}></div>
						</label>
						<label className="item item3">
							<h3>ingridents:</h3>
							<div className="deatils ingredients" dangerouslySetInnerHTML={{ __html: recipe.ingredients }}></div>
						</label>
					</div>
				</div>
			)}
		</>
	);
}

export default ReadRecipe;
