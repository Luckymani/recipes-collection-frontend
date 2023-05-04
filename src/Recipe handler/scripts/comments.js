import React, { useContext, useState, useEffect } from "react";
import "../styles/comments.css";
import { commentContext } from "../../App";
import { AiOutlineSend, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import SingleComment from "./SingleComment";
import { AiFillCloseCircle } from "react-icons/ai";

function Comments() {
	const { showComments, setShowComments, recipeId } = useContext(commentContext);

	const [changed, setChanged] = useState(false);
	const [comment, setComment] = useState("");

	const [commentData, setCommentData] = useState([]);

	console.log(commentData);

	useEffect(() => {
		async function simple() {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/getcomments`, { id: recipeId })
				.then((res) => {
					setCommentData(res.data);
				})
				.catch((err) => {
					console.log(err.response.data);
				});
		}
		simple();
	}, [changed]);

	async function storeComment() {
		if (comment === "") return;
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/addcomment`, { id: recipeId, comment })
			.then((res) => {
				setChanged(!changed);
				setComment("");
			})
			.catch((err) => {
				console.log(err.response.data);
			});
	}

	return (
		<div className="comments-wrapper">
			<div className="comments-container">
				<h2>comments</h2>
				<div className="input-section">
					<input type="text" placeholder="write your comment" value={comment} onChange={(event) => setComment(event.target.value)}></input>
					<AiOutlineSend className="send-icon" onClick={() => storeComment()} />
				</div>
				<div className="wrap-comment">
					{commentData.length >= 1 && (
						<>
							{commentData.map((singleComment) => (
								<SingleComment values={{ singleComment: singleComment, changed: changed, setChanged: setChanged, recipeId: recipeId }} />
							))}
						</>
					)}
				</div>

				<div
					className="close-btn"
					onClick={() => {
						setShowComments(false);
					}}>
					<AiFillCloseCircle className="icon" />
				</div>
			</div>
		</div>
	);
}

export default Comments;
