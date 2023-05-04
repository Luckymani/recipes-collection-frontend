import React, { useRef, useState } from "react";
import "../styles/EditProfile.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile({ deatils }) {
	const navigate = useNavigate();
	const { sameUser, Edit, setEdit, profileData } = deatils;
	const [formData, setFormData] = useState({
		username: profileData.username,
		description: profileData.description,
		imageFile: profileData.profileImage,
	});

	const uploadImageRef = useRef();
	const handleImageFileChange = async (e) => {
		const formImg = new FormData();
		formImg.append("image", e.target.files[0]);
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/uploadimage`, formImg, {
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

	async function updateProfile(e) {
		e.preventDefault();
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/updateprofile`, formData)
			.then((res) => {
				setFormData({ ...formData, imageFile: res.data.filename });
				navigate(`/profile/${formData.username}`);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err.message);
			});
	}

	return (
		<div className="extra-page">
			<div className="deatils_wrapper">
				<h2>edit profile</h2>
				<div
					className="close-btn"
					onClick={() => {
						setEdit(false);
					}}></div>
				<div className="profile-picture">{formData.imageFile ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${formData.imageFile}`} alt="profile-image" className="profile-image"></img> : <FaUserCircle className="profile-icon" />}</div>
				<label className="hide">
					Image File:
					<input type="file" name="imageFile" onChange={handleImageFileChange} ref={uploadImageRef} accept="image/*" />
				</label>
				{profileData.profileImage ? (
					<button
						onClick={() => {
							uploadImageRef.current.click();
						}}
						className="button">
						change profile
					</button>
				) : (
					<button
						onClick={() => {
							uploadImageRef.current.click();
						}}
						className="button">
						upload image
					</button>
				)}
				<form className="update-profile" onSubmit={(e) => updateProfile(e)}>
					<span>
						<label>new username</label>
						<input
							type="text"
							placeholder="new username"
							value={formData.username}
							onChange={(e) => {
								setFormData({ ...formData, username: e.target.value });
							}}></input>
					</span>
					<span>
						<label>description</label>
						<br></br>
						<textarea placeholder="new description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
					</span>
					<button type="submit">update deatils </button>
				</form>
			</div>
		</div>
	);
}

export default EditProfile;
