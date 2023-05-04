import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeCard from "../../Recipe handler/scripts/RecipeCard";
import "../styles/Home.css";

//?all components of swiper
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

//?import context
import { notificationContext } from "../../App";
import { loadingContext } from "../../App";

const catogories = [
	{ id: 1, name: "snacks" },
	{ id: 2, name: "breakfast" },
	{ id: 3, name: "lunch" },
	{ id: 4, name: "cakes" },
	{ id: 5, name: "sweets" },
	{ id: 6, name: "curries" },
	{ id: 7, name: "juices" },
];

function Home() {
	const setNotificationDeatils = useContext(notificationContext);
	const setLoading = useContext(loadingContext);

	const navigate = useNavigate();

	const [recomended, setRecomended] = useState([]);
	const [within15min, setwithin15min] = useState([]);

	useEffect(() => {
		axios.defaults.withCredentials = true;
		async function getRecomended() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/main/recomended`)
				.then((res) => {
					setRecomended(res.data);
				})
				.catch((err) => {
					console.log("something went wrong");
				});

			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/main/within15min`)
				.then((res) => {
					setwithin15min(res.data);
				})
				.catch((err) => {
					console.log("something went wrong");
				});
		}
		getRecomended();
	}, []);

	function catogoryfun(cn) {
		navigate(`/catogory?type=catogory&value=${cn}`);
	}

	return (
		<section className="home">
			<div className="catogories_wrapper">
				<div className="title">
					<h1>search by catogory</h1>
				</div>
				<Swiper
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						520: {
							slidesPerView: 2,
						},
						950: {
							slidesPerView: 4,
						},
					}}
					spaceBetween={20}
					slidesPerGroup={1}
					loop={true}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					loopFillGroupWithBlank={true}
					pagination={{
						clickable: true,
					}}
					navigation={true}
					modules={[Autoplay, Pagination, Navigation]}>
					{catogories.map((catogory) => (
						<SwiperSlide key={catogory.id}>
							<div className="catogory_wrapper" onClick={() => catogoryfun(catogory.name)}>
								<img alt="catogoryimage" src={"/images/" + catogory.name + ".jpg"}></img>
								<p>{catogory.name}</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			<div className="some-recipes">
				<div className="head-line">
					<h1 className="title">Recomended</h1>
					<button onClick={() => navigate(`/catogory?type=recomended`)}> see more</button>
				</div>
				<div className="recipes-wrapper">
					{recomended.map((recipe, index) => (
						<RecipeCard key={index} recipe={recipe} />
					))}
				</div>
			</div>
			<div className="some-recipes">
				<div className="head-line">
					<h1 className="title">within 15 min</h1>
					<button onClick={() => navigate(`/catogory?type=within15min`)}> see more</button>
				</div>
				<div className="recipes-wrapper">
					{within15min.map((recipe, index) => (
						<RecipeCard key={index} recipe={recipe} />
					))}
				</div>
			</div>
		</section>
	);
}

export default Home;
