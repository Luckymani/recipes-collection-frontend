import React, { useContext, useState, useEffect } from "react";
import { FaHeart, FaRegComment, FaTrash, FaSave, FaRegHeart, FaEdit } from "react-icons/fa"; // Import icons from react-icons
import { BsCartX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../styles/RecipeCard.css";
import axios from "axios";

import { commentContext } from "../../App";
import { notificationContext } from "../../App";

const RecipeCard = ({ recipe, sameUser, refresh, setRefresh }) => {
	const [changed, setChanged] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [isWishList, setIsWishList] = useState(false);

	const { showComments, setShowComments, setRecipeId } = useContext(commentContext);

	const navigate = useNavigate();

	useEffect(() => {
		async function simple() {
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
		simple();
	}, [changed]);

	const setNotificationDeatils = useContext(notificationContext);

	async function likefun(id, sameUser) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/like`, { id })
			.then((res) => {
				recipe.likes = recipe.likes + 1;
				setChanged(changed + 1);
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
				setChanged(changed + 1);
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
				setChanged(changed + 1);
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

	async function deleteRecipe(id) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/deleterecipe`, { id })
			.then((res) => {
				setRefresh(!refresh);
				setNotificationDeatils({ showNotification: true, type: "success", message: "recipe deleted" });
			})
			.catch((err) => {
				console.log(err.response.data.error);
				setNotificationDeatils({ showNotification: true, type: "error", message: err.response.data.error });
			});
	}
	return (
		<div className="recipe-card">
			<img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${recipe.imageFile}`} alt={"recipe-image"} className="recipe-image" />
			<div className="recipe-details">
				<h3 className="recipe-name">{recipe.name}</h3>
				<p className="recipe-author" onClick={() => navigate(`/profile/${recipe.author}`)}>
					By {recipe.author}
				</p>
			</div>
			<button onClick={() => navigate(`/readrecipe/${recipe._id}`)}>Read recipe</button>
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

				<div
					className="icon-container"
					onClick={() => {
						setShowComments(true);
						setRecipeId(recipe._id);
					}}>
					<FaRegComment className="icon" />
					<span className="icon-label">{recipe.comments.length}</span>
				</div>
				{sameUser && (
					<div className="icon-container" onClick={() => deleteRecipe(recipe._id)}>
						<FaTrash className="icon" />
					</div>
				)}
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
			{sameUser && (
				<div className="edit" onClick={() => navigate(`/addrecipe?edit=true&id=${recipe._id}`)}>
					<FaEdit />
				</div>
			)}
		</div>
	);
};

export default RecipeCard;
