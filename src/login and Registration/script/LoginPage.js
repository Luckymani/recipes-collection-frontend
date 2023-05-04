import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//?import context
import { notificationContext } from "../../App";
import { userContext } from "../../App";

const LoginPage = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const setNotificationDeatils = useContext(notificationContext);
	const { isLoggedIn, setIsLoggedIn } = useContext(userContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/login`, formData)
			.then((response) => {
				localStorage.setItem("authToken", response.data.jwtToken);
				setIsLoggedIn(true);
				navigate("/");
				setNotificationDeatils({ showNotification: true, type: "success", message: response.data.message });
			})
			.catch((error) => {
				console.log(error.response.data);
				setNotificationDeatils({ showNotification: true, type: "error", message: error.response.data.error });
			});
	};

	return (
		<section className="login-page">
			<div className="background">
				<img src="/images/background.jpg"></img>
			</div>
			<div className="login-form">
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Email:</label>
						<input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<div className="password-wrapper">
							<input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required />
							<p
								className="eye"
								onClick={() => {
									setShowPassword(!showPassword);
								}}>
								{showPassword ? <FaRegEye></FaRegEye> : <FaRegEyeSlash />}
							</p>
						</div>
					</div>
					<button type="submit">Login</button>
				</form>
				<div className="register-link">
					Don't have an account? <Link to="/register">Register</Link>
				</div>
				<div className="forgot-password-link" onClick={() => navigate("/forgotpassword")}>
					{" "}
					forgot password
				</div>
			</div>
		</section>
	);
};

export default LoginPage;
