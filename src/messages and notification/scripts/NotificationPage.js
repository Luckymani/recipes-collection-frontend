import React from "react";
import "../styles/Notification.css";
import { motion } from "framer-motion";

const NotificationPage = (props) => {
	const { message, type } = props.values;

	return (
		<motion.div className={`notification ${type}`} initial={{ x: "400px", opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { type: "spring" } }}>
			{console.log("notification page")}
			<p> {message}</p>
		</motion.div>
	);
};

export default NotificationPage;
