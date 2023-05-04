import React, { useState, useContext, useEffect } from "react";
import "../style/RegistrationLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { validateUsername, validatePassword, validateEmail, validateConfirmPassword } from "./Validations";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";

//? importing context
import { notificationContext } from "../../App";

const RegistrationPage = () => {
	const setNotificationDeatils = useContext(notificationContext);
	const [showPassword, setShowPassword] = useState(false);
	const [showconfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		setNotificationDeatils({ showNotification: true, type: "warning", message: "register you account" });
	}, []);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });

		switch (name) {
			case "username":
				setErrors({
					...errors,
					username: validateUsername(value),
				});
				break;
			case "email":
				setErrors({
					...errors,
					email: validateEmail(value),
				});
				break;
			case "password":
				setErrors({
					...errors,
					password: validatePassword(value),
				});
				break;
			case "confirmPassword":
				setErrors({
					...errors,
					confirmPassword: validateConfirmPassword(formData.password, value),
				});
				break;
			default:
				break;
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const { username, password, confirmPassword, email } = errors;
		if (username || password || confirmPassword || email) return;

		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/register`, formData)
			.then((response) => {
				navigate("/activationmessage");
				setNotificationDeatils({ showNotification: true, type: "success", message: response.data });
			})
			.catch((error) => {
				// Handle error response from the server
				console.log(error.response.data);
				setNotificationDeatils({ showNotification: true, type: "error", message: error.response.data.error });
			});
	};

	return (
		<section className="registration-page">
			<div className="background">
				<img src="/images/background.jpg"></img>
			</div>
			<div className="registration-form">
				<h2>Register</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} required />
						{errors.username && <p className="error">{errors.username}</p>}
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required />
						{errors.email && <p className="error">{errors.email}</p>}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<div className="password-wrapper">
							<input type={showPassword ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleInputChange} required />
							<p
								className="eye"
								onClick={() => {
									setShowPassword(!showPassword);
								}}>
								{showPassword ? <FaRegEye></FaRegEye> : <FaRegEyeSlash />}
							</p>
						</div>
						{errors.password && <p className="error">{errors.password}</p>}
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<div className="password-wrapper">
							<input type={showconfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
							<p
								onClick={() => {
									setShowConfirmPassword(!showconfirmPassword);
								}}
								className="eye">
								{showconfirmPassword ? <FaRegEye></FaRegEye> : <FaRegEyeSlash />}
							</p>
						</div>
						{errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
					</div>

					<button type="submit">Register</button>
				</form>
				<p>
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</section>
	);
};

export default RegistrationPage;
