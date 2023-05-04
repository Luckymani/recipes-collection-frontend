import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../../Recipe handler/scripts/RecipeCard";
import "../styles/recipe.css";

function Recipes() {
	const [count, setCount] = useState(0);
	const [recipeList, setRecipeList] = useState([]);

	useEffect(() => {
		axios.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/getallrecipes`, { count })
			.then((res) => {
				console.log(res.data);
				setRecipeList([...recipeList, ...res.data]);
			})
			.catch((err) => {
				console.log(err.response.data);
			});
	}, [count]);
	return (
		<section className="recipes">
			<div className="title">
				<h1>all recipes</h1>
			</div>

			{recipeList && (
				<div className="catogory-recipes">
					{recipeList.map((recipe, index) => (
						<RecipeCard key={index} recipe={recipe} />
					))}
				</div>
			)}

			<button className="loadmore" onClick={() => setCount(count + 1)}>
				{" "}
				load more
			</button>
		</section>
	);
}

export default Recipes;
