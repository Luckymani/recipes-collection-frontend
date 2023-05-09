import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import axios from "axios";
import { motion } from "framer-motion";

const Navbar = () => {
	const { isLoggedIn, setIsLoggedIn } = useContext(userContext);

	const menuBtnRef = useRef(null);
	const navRef = useRef(null);
	const searchRef = useRef(null);
	const listRef = useRef(null);

	const [userInfo, setUserInfo] = useState({ name: "", profileImage: "" });
	const [menuBtn, setMenuBtn] = useState(false);
	const navigate = useNavigate();

	const [searchbarVisibilty, setSearchbarVisibility] = useState(false);
	const [searchValue, setSearchValue] = useState();
	const [arrayList, setArrayList] = useState([]);
	useEffect(()=>{
		axios.defaults.withCredentials=true
	},[])

	useEffect(() => {
		if (!searchbarVisibilty) return;
		async function getArrayList() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/getallrecipenames`)
				.then((res) => {
					setArrayList(res.data.recipeNames);
				})
				.catch((err) => {
					console.log(err.response.data.error);
				});
		}
		getArrayList();
	}, [searchbarVisibilty]);

	useEffect(() => {
		// if (!isLoggedIn) return;
		async function getUserInfo() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/profile/getusername`)
				.then((res) => {
					setUserInfo(res.data);
				})
				.catch((err) => {
					console.log(err.response.data.error);
				});
		}
		getUserInfo();
	}, [isLoggedIn]);

	useEffect(() => {
		function clickFun(event) {
			if (menuBtnRef.current && !menuBtnRef.current.contains(event.target) && navRef.current && !navRef.current.contains(event.target)) {
				setMenuBtn(false);
			}
		}
		window.addEventListener("click", clickFun);

		return () => {
			window.removeEventListener("click", clickFun);
		};
	});

	useEffect(() => {
		function clickFun(event) {
			if (listRef.current && !searchRef.current.contains(event.target)) {
				setSearchbarVisibility(false);
			}
		}
		window.addEventListener("click", clickFun);

		return () => {
			window.removeEventListener("click", clickFun);
		};
	});

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
		<section className="navbar">
			{console.log(arrayList)}
			{userInfo && (
				<nav className="navbar-container">
					<div className="navbar-logo" onClick={() => navigate("/")}>
						<img className="logo-image" src="/images/logo.png"></img>
						<div>
							<p>Recipe</p>
							<p>collection</p>
						</div>
					</div>
					{isLoggedIn ? (
						<div className="navbar-links hide">
							<Link to="/">Home</Link>
							<Link to="/about">About</Link>
							<Link to="/recipes">Recipes</Link>
						</div>
					) : (
						<div className="navbar-links">
							<button className="nav-button" onClick={() => navigate("/login")}>
								Login
							</button>
							<button className="nav-button" onClick={() => navigate("/register")}>
								Sign Up
							</button>
						</div>
					)}
					{isLoggedIn && (
						<div className="navbar-search">
							<div className="search-bar">
								<input type="text" placeholder="Search" ref={searchRef} onFocus={() => setSearchbarVisibility(true)} onChange={(e) => setSearchValue(e.target.value)} />
								{searchbarVisibilty && (
									<div className="search_list">
										<ul>
											{arrayList.map((val, index) => {
												return (
													val.name.includes(searchValue) && (
														<li
															ref={listRef}
															key={index}
															onClick={() => {
																navigate(`/catogory?type=name&value=${val.name}`);
																window.location.reload();
															}}>
															{console.log(val.name)}
															{val.name}
														</li>
													)
												);
											})}
										</ul>
									</div>
								)}
							</div>
							<FaSearch className="search-icon" />
						</div>
					)}
					{isLoggedIn && (
						<div style={{ cursor: "pointer" }} className="navbar-profile" onClick={() => navigate(`/profile/${userInfo.username}`)}>
							<span>{userInfo.username}</span>
							{userInfo.profileImage ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${userInfo.profileImage}`} className="profile-image"></img> : <FaUserCircle className="profile-icon" />}
						</div>
					)}
					{isLoggedIn && <div className="extra"></div>}
					{isLoggedIn && (
						<div className="menu-btn" ref={menuBtnRef}>
							<svg className="svg">
								<defs>
									<filter id="gooeyness">
										<feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
										<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooeyness" />
										<feComposite in="SourceGraphic" in2="gooeyness" operator="atop" />
									</filter>
								</defs>
							</svg>

							<div className={`plate plate1 ${menuBtn && "active"}`} onClick={() => setMenuBtn(!menuBtn)}>
								<svg className="burger svg" version="1.1" height="100" width="100" viewBox="0 0 100 100">
									<path className="line line1" d="M 30,65 H 70" />
									<path className="line line2" d="M 70,50 H 30 C 30,50 18.644068,50.320751 18.644068,36.016949 C 18.644068,21.712696 24.988973,6.5812347 38.79661,11.016949 C 52.604247,15.452663 46.423729,62.711864 46.423729,62.711864 L 50.423729,49.152542 L 50.423729,16.101695" />
									<path className="line line3" d="M 30,35 H 70 C 70,35 80.084746,36.737688 80.084746,25.423729 C 80.084746,19.599612 75.882239,9.3123528 64.711864,13.559322 C 53.541489,17.806291 54.423729,62.711864 54.423729,62.711864 L 50.423729,49.152542 V 16.101695" />
								</svg>
								<svg className="x svg" version="1.1" height="100" width="100" viewBox="0 0 100 100">
									<path className="line" d="M 34,32 L 66,68" />
									<path className="line" d="M 66,32 L 34,68" />
								</svg>
							</div>
						</div>
					)}
					{isLoggedIn && (
						<motion.ul className={`nav-links-mobile `} ref={navRef} initial={{ clipPath: "circle(0px at 95% 20px)" }} animate={menuBtn ? { clipPath: "circle(600px at 95% 20px)" } : { clipPath: "circle(0px at 95% 20px)" }}>
							<li>
								<div className="navbar-profile" onClick={() => navigate(`/profile/${userInfo.username}`)}>
									{userInfo.profileImage ? <img className="profile-image" src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${userInfo.profileImage}`}></img> : <FaUserCircle className="profile-icon" />}
									<p>{userInfo.username}</p>
								</div>
							</li>
							<li
								onClick={() => {
									navigate("/");
								}}>
								Home
							</li>
							<li
								onClick={() => {
									navigate("/about");
								}}>
								About
							</li>
							<li
								onClick={() => {
									navigate("/addrecipe");
								}}>
								add recipe
							</li>
							<li
								onClick={() => {
									navigate("/catogory?type=wishlist");
								}}>
								wish list
							</li>
							<li onClick={() => logout()}>logout</li>
							<li
								onClick={() => {
									navigate("/recipes");
								}}>
								recipes
							</li>
						</motion.ul>
					)}
				</nav>
			)}
		</section>
	);
};

export default Navbar;
