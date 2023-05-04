import React, { useContext, useEffect, useState, useRef } from "react";
import "../styles/profile.css"; // Import the CSS file for styling
import RecipeCard from "../../Recipe handler/scripts/RecipeCard";
import { loadingContext } from "../../App";
import { notificationContext } from "../../App";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";

import { userContext } from "../../App";
import EditProfile from "./EditProfile";

const ProfilePage = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(userContext);

	const setLoading = useContext(loadingContext);
	const setNotificationDeatils = useContext(notificationContext);
	const [profileData, setProfileData] = useState(null);
	const { username } = useParams();
	const navigate = useNavigate();

	const [sameUser, setSameUser] = useState(false);
	const [following, setFollowing] = useState(true);
	const [refresh, setRefresh] = useState(false);

	const [edit, setEdit] = useState(false);
	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);

	const [followersDeatils, setFollowersDeatils] = useState([]);
	const [followingDeatils, setFollowingDeatils] = useState([]);

	useEffect(() => {
		setRefresh(!refresh);
	}, [username]);

	useEffect(() => {
		async function simple() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile`, { username })
				.then((res) => {
					setProfileData(res.data);
				})
				.catch((err) => {
					console.log(err.response.data.error);
					navigate("/pagenotfound");
					setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
				});
		}
		simple();
	}, [refresh]);

	useEffect(() => {
		async function checkForSameUser() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/checkforsameuser`, { username })
				.then((res) => {
					setSameUser(res.data.sameUser);
					setFollowing(res.data.following);
				})
				.catch((err) => {
					console.log(err.response.data.error);
					setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
				});
		}
		checkForSameUser();
	}, [refresh]);

	useEffect(() => {
		if (!showFollowers) return;
		async function getFollowers() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/getfollowers`, { username })
				.then((res) => {
					setFollowersDeatils(res.data);
				})
				.catch((err) => {
					console.log(err.response.data.message);
				});
		}
		getFollowers();
	}, [showFollowers, refresh]);
	useEffect(() => {
		if (!showFollowing) return;
		async function getFollowing() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/getfollowing`, { username })
				.then((res) => {
					setFollowingDeatils(res.data);
				})
				.catch((err) => {
					console.log(err.response.data.message);
				});
		}
		getFollowing();
	}, [showFollowing, refresh]);

	async function unfollowFun() {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/unfollow`, { username })
			.then((res) => {
				setRefresh(!refresh);
			})
			.catch((err) => {
				setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
			});
	}
	async function unfollowFun2(user) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/unfollow`, { username: user })
			.then((res) => {
				setRefresh(!refresh);
			})
			.catch((err) => {
				setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
			});
	}

	async function followFun() {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/follow`, { username })
			.then((res) => {
				setRefresh(!refresh);
			})
			.catch((err) => {
				setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
			});
	}

	async function removeFollowerFun(user) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/removefollower`, { username: user })
			.then((res) => {
				setRefresh(!refresh);
			})
			.catch((err) => {
				setNotificationDeatils({ type: "error", showNotification: true, message: err.response.data.error });
			});
	}

	async function logout() {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/logout`)
			.then((res) => {
				localStorage.removeItem("authToken");
				setIsLoggedIn(false);
				navigate("/login");
			})
			.catch((err) => {
				console.log(err.message);
				console.log("something went wrong");
			});
	}

	return (
		<section className="profile-page">
			{profileData && (
				<>
					<div className="profile-container">
						<div className="profile-header">
							<div className="profile-picture">{profileData.profileImage ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${profileData.profileImage}`} alt="profile-image" className="profile-image"></img> : <FaUserCircle className="profile-icon" />}</div>
							<div className="profile-info">
								<h1 className="recipe-name">{profileData.username}</h1>
								<div className="follower-following">
									<div onClick={() => setShowFollowers(true)}>
										<span>followers</span>
										<span className="count">{profileData.followers}</span>
									</div>
									<div onClick={() => setShowFollowing(true)}>
										<span>following</span>
										<span className="count">{profileData.following}</span>
									</div>
									<div>
										<span>recipes</span> <span className="count">{profileData.recipesCount}</span>
									</div>
								</div>
								{!sameUser && (
									<>
										{following ? (
											<button className="follow-button" onClick={() => unfollowFun()}>
												Unfollow
											</button>
										) : (
											<button className="follow-button" onClick={() => followFun()}>
												Follow
											</button>
										)}
									</>
								)}
								{sameUser && (
									<button className="edit-button" onClick={() => setEdit(true)}>
										Edit
									</button>
								)}
								{sameUser && (
									<button className="follow-button" onClick={() => logout()}>
										logout
									</button>
								)}
							</div>
						</div>
						<div className="profile-description">{profileData.description}</div>
					</div>
					<h2 className="headding">Recipes</h2>
					<div className="recipes-grid-container">
						{profileData.recipes.map((recipe, index) => (
							<RecipeCard key={index} recipe={recipe} sameUser={sameUser} refresh={refresh} setRefresh={setRefresh} />
						))}
					</div>
					{showFollowers && (
						<section className="extra-page followers">
							{followersDeatils && (
								<div className="deatils_wrapper">
									<h2>followers</h2>
									<div
										className="close-btn"
										onClick={() => {
											setShowFollowers(false);
										}}>
										<AiFillCloseCircle className="icon" />
									</div>
									<ul className="profile-list">
										{followersDeatils.map((eachProfile, index) => (
											<li key={index}>
												<div className="wrapper" key={index}>
													<div className="wrap">
														<div className="image">{eachProfile.profileImage ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${profileData.profileImage}`} alt="profile-image" className="profile-image"></img> : <FaUserCircle className="profile-icon" />}</div>
														<h3>{eachProfile.username}</h3>
													</div>
													{sameUser && showFollowers && (
														<button
															className="button"
															onClick={() => {
																removeFollowerFun(eachProfile.username);
															}}>
															remove
														</button>
													)}
													{!sameUser && showFollowers && (
														<button
															className="button"
															onClick={() => {
																navigate(`/profile/${eachProfile.username}`);
															}}>
															view profile
														</button>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							)}
						</section>
					)}

					{showFollowing && (
						<section className="extra-page following">
							{followingDeatils && (
								<div className="deatils_wrapper">
									<h2>following</h2>
									<div
										className="close-btn"
										onClick={() => {
											setShowFollowing(false);
										}}>
										<AiFillCloseCircle className="icon" />
									</div>
									<ul className="profile-list">
										{followingDeatils.map((eachProfile, index) => (
											<li key={index}>
												<div className="wrapper" key={index}>
													<div className="wrap">
														<div className="image">{eachProfile.profileImage ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${eachProfile.profileImage}`} alt="profile-image" className="profile-image"></img> : <FaUserCircle className="profile-icon" />}</div>
														<h3>{eachProfile.username}</h3>
													</div>
													{sameUser && showFollowing && (
														<button
															className="button"
															onClick={() => {
																unfollowFun2(eachProfile.username);
															}}>
															un follow
														</button>
													)}
													{!sameUser && showFollowing && (
														<button
															className="button"
															onClick={() => {
																navigate(`/profile/${eachProfile.username}`);
															}}>
															view profile
														</button>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							)}
						</section>
					)}
					{edit && <EditProfile deatils={{ sameUser: sameUser, edit: edit, setEdit: setEdit, profileData: profileData }} />}
				</>
			)}
		</section>
	);
};

export default ProfilePage;
