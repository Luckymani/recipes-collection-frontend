import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "./Validations";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
//?import contexts here
import { notificationContext } from "../../App";

const ForgotPasswordPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		otp: "",
		newPassword: "",
	});

	const [errors, setErrors] = useState({
		email: "",
		newPassword: "",
	});

	const [isEmailSent, setIsEmailSent] = useState(false);
	const [isOTPValid, setIsOTPValid] = useState(false);

	const setNotificationDeatils = useContext(notificationContext);

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setFormData({
			...formData,
			[name]: value,
		});
		switch (name) {
			case "email":
				return setErrors({ ...errors, email: validateEmail(value) });
			case "newPassword":
				return setErrors({ ...errors, newPassword: validatePassword(value) });
			default:
				return null;
		}
	};

	const handleEmailSubmit = async (event) => {
		event.preventDefault();
		if (!errors.email) {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/login/forgotpassword`, formData)
				.then((res) => {
					setIsEmailSent(true);
					setNotificationDeatils({ showNotification: true, message: res.data.message, type: "success" });
				})
				.catch((err) => {
					console.log(err.response.data);
					setNotificationDeatils({ showNotification: true, message: err.response.data.error, type: "error" });
				});
		}
	};

	const handleOTPSubmit = async (event) => {
		event.preventDefault();
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/login/otpverification`, formData)
			.then((res) => {
				setIsOTPValid(true);
				setNotificationDeatils({ showNotification: true, message: res.data.message, type: "success" });
			})
			.catch((err) => {
				console.log(err.response.data);
				setNotificationDeatils({ showNotification: true, message: err.response.data.error, type: "error" });
			});
	};

	const handleNewPasswordSubmit = async (event) => {
		event.preventDefault();
		if (errors.newPassword) return console.log(errors.newPassword);
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/login/passwordChange`, formData)
			.then((res) => {
				setIsOTPValid(true);
				navigate("/login");
				setNotificationDeatils({ showNotification: true, message: res.data.message, type: "success" });
			})
			.catch((err) => {
				console.log(err.response.data);
				setNotificationDeatils({ showNotification: true, message: err.response.data.error, type: "error" });
			});
	};

	return (
		<section className="forgot-password-page">
			<div className="background">
				<img src="/images/background.jpg"></img>
			</div>
			<div className="forgot-password-form">
				{!isEmailSent && (
					<>
						<h2>Forgot Password</h2>
						<form onSubmit={handleEmailSubmit}>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
								{errors.email && <p className="error">{errors.email}</p>}
							</div>
							<button type="submit">Send OTP</button>
						</form>
					</>
				)}
				{isEmailSent && !isOTPValid && (
					<>
						<h2>Enter OTP</h2>
						<form onSubmit={handleOTPSubmit}>
							<div className="form-group">
								<label htmlFor="otp">OTP</label>
								<input type="number" id="otp" name="otp" value={formData.otp} onChange={handleInputChange} />
							</div>
							<button type="submit">Verify OTP</button>
						</form>
					</>
				)}
				{isOTPValid && (
					<>
						<h2>Set New Password</h2>
						<form onSubmit={handleNewPasswordSubmit}>
							<div className="form-group">
								<label htmlFor="newPassword">New Password</label>
								<div className="password-wrapper">
									<input type={showPassword ? "text" : "password"} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} required />
									<p
										className="eye"
										onClick={() => {
											setShowPassword(!showPassword);
										}}>
										{showPassword ? <FaRegEye></FaRegEye> : <FaRegEyeSlash />}
									</p>
								</div>
								{errors.newPassword && <p className="error">{errors.newPassword}</p>}
							</div>
							<button type="submit">Set New Password</button>
						</form>
					</>
				)}
				<div className="login-link">
					Remember your password? <Link to="/login">Login</Link>
				</div>
			</div>
		</section>
	);
};

export default ForgotPasswordPage;
