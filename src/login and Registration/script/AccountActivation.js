import React, { useEffect, useState, useContext } from "react";
import "../style/AccountActivation.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

//? importing context
import { notificationContext } from "../../App";

const AccountActivation = () => {
	const setNotificationDeatils = useContext(notificationContext);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const username = searchParams.get("username");
	const code = searchParams.get("code");

	const [activated, setActivated] = useState(false);
	const [invalidLink, setInvalidLink] = useState(false);
	const [showTick, setShowTick] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setShowTick(true);
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	useEffect(() => {
		const data = { username, code };
		console.log(data);
		async function simple() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/register/accountactivation`, data)
				.then((response) => {
					setNotificationDeatils({ showNotification: true, type: "success", message: response.data });
					setActivated(true);
					setInvalidLink(false);
				})
				.catch((error) => {
					// Handle error response from the server
					console.log(error.response.data);
					setNotificationDeatils({ showNotification: true, type: "error", message: error.response.data.error });
					setActivated(false);
					setInvalidLink(true);
				});
		}
		simple();
	}, [username, code]);

	return (
		<>
			{activated && (
				<div className="activation-success-container">
					<div className="activation-success-circle">
						{showTick && (
							<svg className="success-tick" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle className="circle" cx="50" cy="50" r="38" stroke="#50AD41" fill="#50AD41" strokeWidth="10" />
								<circle className="circle-fill" cx="50" cy="50" r="0" stroke="#ffffff" fill="#ffffff" strokeWidth="0" />
								<path className="tick-mark" d="M28 52.5C29.0884 53.9803 36.2254 62.2114 40.7238 67.364C41.4939 68.2461 42.8517 68.2769 43.6648 67.4343L74 36" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						)}
					</div>
					<div className="activation-success-message">
						<h1>Account Activated!</h1>
						<p>Your account has been successfully activated.</p>
						<p>
							go to loginpage <Link to="/login">login</Link>
						</p>
						<p>Thank you for joining us!</p>
					</div>
				</div>
			)}
			{invalidLink && (
				<div className="invalid-link">
					<h1>invalid link</h1>
				</div>
			)}
		</>
	);
};

export default AccountActivation;
