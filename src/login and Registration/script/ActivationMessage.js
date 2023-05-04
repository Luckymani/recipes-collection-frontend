import React from "react";
import { Link } from "react-router-dom";
import "../style/ActivationMessage.css";

const ActivationMessagePage = () => {
	return (
		<div className="activation-message">
			<h1 className="title">Account Activation</h1>
			<p className="message">Thank you for registering with our service. An activation link has been sent to your email address. Please check your email and follow the instructions to activate your account.</p>
			<p className="message">If you have already activated your account, you can click the link below to go to the login:</p>
			<Link to="/login" className="link">
				login page
			</Link>
			<p className="message">If you do not receive the activation email, please check your spam folder or contact our support team for assistance.</p>
			<p className="message">If you have any questions or need further assistance, please contact our support team at </p>
		</div>
	);
};

export default ActivationMessagePage;
