import React, { useState, useRef, useContext, useEffect } from "react";
import "../styles/AddRecipe.css"; // Import the CSS file for styling
import axios from "axios";
import { notificationContext } from "../../App.js";
import { useSearchParams, useNavigate } from "react-router-dom";

const AddRecipeForm = () => {
	const navigate = useNavigate();
	const [searchParamas, setSearchParams] = useSearchParams();
	const [progress, setProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [uploadCancelToken, setUploadCancelToken] = useState(null);
	const setNotificationDeatils = useContext(notificationContext);
	const edit = searchParamas.get("edit");
	const id = searchParamas.get("id");
	const uploadImageRef = useRef(null);
	const uploadVideoRef = useRef(null);
	const [formData, setFormData] = useState({
		name: "",
		servings: "",
		duration: "",
		catogory: "snacks",
		imageFile: "",
		videoFile: "",
		aboutRecipe: "",
		ingredients: "",
		preparation: "",
	});

	useEffect(() => {
		if (!id) return;
		async function getrecipe() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/readrecipe`, { id })
				.then((res) => {
					setFormData({ name: res.data.name, servings: res.data.servings, duration: res.data.duration, catogory: res.data.catogory, imageFile: res.data.imageFile, videoFile: res.data.videoFile, aboutRecipe: res.data.aboutRecipe, ingredients: res.data.ingredients, preparation: res.data.preparation });
				})
				.catch((err) => {
					console.log(err.response.data.error);
					navigate("/pagenotfound");
					setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
				});
		}
		getrecipe();
	}, []);

	const handleCancelUpload = () => {
		// If upload is in progress, cancel the upload using the cancel token
		if (uploading && uploadCancelToken) {
			uploadCancelToken.cancel("Upload cancelled by user");
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageFileChange = async (e) => {
		const formImg = new FormData();
		formImg.append("image", e.target.files[0]);

		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/uploadimage`, formImg, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				setFormData({ ...formData, imageFile: res.data.filename });
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const handleVideoFileChange = async (e) => {
		// Create an axios cancel token source for handling cancellation
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		const formVideo = new FormData();
		formVideo.append("video", e.target.files[0]);

		setUploading(true);
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/uploadvideo`, formVideo, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const progressPercentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setProgress(progressPercentage); // Update progress state
				},
				cancelToken: source.token,
			})
			.then((response) => {
				setFormData({ ...formData, videoFile: response.data.filename });
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					console.log("File upload cancelled", error);
				} else {
					console.error("Error uploading file", error);
				}
			})
			.finally(() => {
				setProgress(0);
				setUploading(false);
				setUploadCancelToken(null);
			});
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (formData.imageFile === "") {
			return setNotificationDeatils({ type: "warning", message: "select image", showNotification: true });
		}
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/addrecipe`, formData)
			.then((res) => {
				setNotificationDeatils({ type: "success", message: res.data.message, showNotification: true });
				navigate(`/readrecipe/${res.data.recipeId}`);
			})
			.catch((error) => {
				setNotificationDeatils({ type: "error", message: error.data.response.error, showNotification: true });
			});
	};

	async function updateRecipefn() {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/updaterecipe`, { formData, id })
			.then((res) => {
				setNotificationDeatils({ type: "success", message: res.data.message, showNotification: true });
			})
			.catch((error) => {
				setNotificationDeatils({ type: "error", message: error.data.response.error, showNotification: true });
			});
	}

	const { name, servings, imageFile, videoFile, aboutRecipe, ingredients, preparation, duration } = formData;

	return (
		<div className="add-recipe-form-container">
			<h1 className="add-recipe-form-title">Add Recipe</h1>
			<form className="add-recipe-form" onSubmit={handleFormSubmit}>
				<div className="deatils_container">
					<div className="content-container">
						<label>
							Recipe Name:
							<input type="text" name="name" value={name} onChange={handleInputChange} required />
						</label>

						<label>
							Catogory:
							<select name="catogory" id="catogory" value={formData.catogory} onChange={handleInputChange} required>
								<option value="snacks">snacks</option>
								<option value="breakfast">breakfast</option>
								<option value="lunch">lunch</option>
								<option value="cakes">cakes</option>
								<option value="chicken">sweets</option>
								<option value="drinks">drinks</option>
								<option value="curries">curries</option>
							</select>
						</label>

						<label>
							Servings:
							<input type="number" name="servings" value={servings} onChange={handleInputChange} required />
						</label>

						<label>
							Duration:
							<input type="number" name="duration" value={duration} onChange={handleInputChange} placeholder="minutes" required />
						</label>
					</div>
					<div className="media-container">
						<div className="image-container">
							<div className="image">{imageFile == "" ? <img src="/images/recipe icon image.jpg" alt="recipe-image" required></img> : <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${imageFile}`} alt="recipe-image" required></img>}</div>
							<label>
								Image File:
								<input type="file" name="imageFile" onChange={handleImageFileChange} ref={uploadImageRef} accept="image/*" />
							</label>
							<div className="button" onClick={() => uploadImageRef.current.click()}>
								{" "}
								upload image
							</div>
						</div>
						<div className="video-container">
							<div className="video-wrapper">
								<div className="video">
									{uploading && <p>{progress}%</p>}
									{videoFile ? <video src={`${process.env.REACT_APP_SERVER_ADDRESS}/videos/${videoFile}`} controls></video> : <video src="nothing" controls></video>}
								</div>
								<label>
									Video File:
									<input type="file" name="videoFile" onChange={handleVideoFileChange} ref={uploadVideoRef} accept="video/*" />
								</label>
								{uploading ? (
									<div className="button" onClick={() => handleCancelUpload()}>
										cancel
									</div>
								) : (
									<div className="button" onClick={() => uploadVideoRef.current.click()}>
										upload video
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="info-container">
					<label>
						About Recipe:
						<textarea name="aboutRecipe" value={aboutRecipe} onChange={handleInputChange} required></textarea>
					</label>
					<label>
						Ingredients:
						<p>enter ingridents line by line</p>
						<textarea name="ingredients" value={ingredients} onChange={handleInputChange} required></textarea>
					</label>
					<label>
						Preparation:
						<p>write step by step process</p>
						<textarea name="preparation" value={preparation} onChange={handleInputChange} required></textarea>
					</label>
				</div>
				{edit ? (
					<div className="add-recipe-form-submit" style={{ width: "100%", height: "100%" }} onClick={() => updateRecipefn()}>
						update Recipe
					</div>
				) : (
					<button className="add-recipe-form-submit" type="submit">
						Add Recipe
					</button>
				)}
			</form>
		</div>
	);
};

export default AddRecipeForm;
