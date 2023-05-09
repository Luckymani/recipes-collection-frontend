import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import axios from "axios";

//*import components
import RegistrationPage from "./login and Registration/script/RegistrationPage";
import LoginPage from "./login and Registration/script/LoginPage.js";
import ForgotPasswordPage from "./login and Registration/script/ForgotPasswordPage";
import NotificationPage from "./messages and notification/scripts/NotificationPage";
import LoadingPage from "./messages and notification/scripts/LoadingPage";
import Navbar from "./components/scripts/Navbar";
import PageNotFound from "./components/scripts/PageNotFound";
import AddRecipe from "./Recipe handler/scripts/AddRecipe";
import ActivationMessagePage from "./login and Registration/script/ActivationMessage";
import AccountActivation from "./login and Registration/script/AccountActivation";
import Home from "./components/scripts/Home";
import ReadRecipe from "./Recipe handler/scripts/ReadRecipe";
import RecipeCard from "./Recipe handler/scripts/RecipeCard";
import ProfilePage from "./components/scripts/profile";
import Catogory from "./Recipe handler/scripts/catogory";
import Buttons from "./components/scripts/wishlistbutton";
import Comments from "./Recipe handler/scripts/comments";
import Recipes from "./components/scripts/Recipes";

//?context that need to export
export const notificationContext = React.createContext();
export const loadingContext = React.createContext();
export const userContext = React.createContext();
export const commentContext = React.createContext();


function App() {
	useEffect(()=>{
		axios.defaults.withCredentials=true;
	},[])
	axios.defaults.withCredentials = true;

	//*loading handler
	const [loading, setLoading] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [recipeId, setRecipeId] = useState("");
	console.log(recipeId, "recipe id");
	// //*notification handler
	const navigate = useNavigate();
	const [notificationDeatils, setNotificationDeatils] = useState({
		showNotification: false,
		message: "",
		type: "",
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	//?closing notification after 3 seconds
	useEffect(() => {
		if (notificationDeatils.showNotification) {
			const timeoutId = setTimeout(() => {
				setNotificationDeatils({ ...notificationDeatils, showNotification: false });
			}, 3000);
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [notificationDeatils]);

	//? handling login information
	useEffect(() => {
		if (isLoggedIn) return console.log("no need to verify just logged in");
		console.log("useEffect in appcomponent");
		const accountactivationpath = window.document.location.pathname == "/accountactivation/";
		console.log(window.location.pathname);
		console.log("accountactivation path", accountactivationpath);
		if (accountactivationpath) return;
		async function simple() {
			const authToken = localStorage.getItem("authToken");
			if (!authToken) return navigate("/login");

			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/main`, { authToken })
				.then((response) => {
					setIsLoggedIn(true);
				})
				.catch((error) => {
					setNotificationDeatils({ showNotification: true, type: "error", message: error.response.data.error });
					navigate("/login");
				});
		}
		simple();
	}, [isLoggedIn]);

	return (
		<>
			{console.log("app component")}
			{loading && <LoadingPage />}
			{notificationDeatils.showNotification && <NotificationPage values={notificationDeatils} />}
			<notificationContext.Provider value={setNotificationDeatils}>
				<loadingContext.Provider value={setLoading}>
					<userContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
						<commentContext.Provider value={{ showComments, setShowComments, setRecipeId, recipeId }}>
							{showComments && <Comments />}
							{!loading && (
								<div className="App">
									<Navbar />
									{isLoggedIn && <Buttons />}
									<Routes>
										<Route path="/*" element={<PageNotFound />}></Route>
										<Route path="/forgotpassword" element={<ForgotPasswordPage />}></Route>
										<Route path="/login" element={<LoginPage />}></Route>
										<Route path="/register" element={<RegistrationPage />}></Route>
										<Route path="/activationmessage" element={<ActivationMessagePage></ActivationMessagePage>}></Route>
										<Route path="/accountactivation" element={<AccountActivation />}></Route>
										<Route path="/" element={<Home />}></Route>
										<Route path="/recipecard" element={<RecipeCard />}></Route>
										<Route path="/addrecipe" element={<AddRecipe />}></Route>
										<Route path="/catogory" element={<Catogory />}></Route>
										<Route path="/readrecipe/:id" element={<ReadRecipe />}></Route>
										<Route path="/profile/:username" element={<ProfilePage />}></Route>
										<Route path="/recipes" element={<Recipes />}></Route>
									</Routes>
								</div>
							)}
						</commentContext.Provider>
					</userContext.Provider>
				</loadingContext.Provider>
			</notificationContext.Provider>
		</>
	);
}

export default App;
