import React from "react";
import "../styles/Loading.css";
function LoadingPage() {
	return (
		<section className="loading-page">
			<div className="container">
				<div className="box"></div>
				<div className="box"></div>
				<div className="box"></div>
				<div className="box"></div>
				<div className="box"></div>
				<h3 className="loading-text">
					Loading <span>. </span>
					<span>. </span>
					<span>. </span>
				</h3>
			</div>
		</section>
	);
}

export default LoadingPage;
