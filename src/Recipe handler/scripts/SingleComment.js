import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";

function SingleComment({ values }) {
	const { singleComment, changed, setChanged, recipeId } = values;
	const [sameUser, setSameUser] = useState(false);

	useEffect(() => {
		async function simple(commentId) {
			await axios
				.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/sameuser`, { recipeId: recipeId, commentId: commentId })
				.then((res) => {
					setSameUser(true);
				})
				.catch((err) => {
					setSameUser(false);
					console.log(err.response.data);
				});
		}
		simple(singleComment.commentId);
	}, [changed, singleComment]);

	async function deleteComment(commentId) {
		await axios
			.post(`${process.env.REACT_APP_SERVER_ADDRESS}/recipe/deletecomment`, { recipeId: recipeId, commentId: commentId })
			.then((res) => {
				setChanged(!changed);
			})
			.catch((err) => {
				console.log(err.response.data);
			});
	}

	return (
		<div className="single-comment">
			<div className="info-wrapper">
				<div className="wrap">
					<div className="image">{singleComment.profileImg ? <img src={`${process.env.REACT_APP_SERVER_ADDRESS}/images/${singleComment.profileImg}`} alt="profile-image" className="profile-image"></img> : <FaUserCircle className="profile-icon" />}</div>
					<p>{singleComment.username}</p>
				</div>
				{sameUser && <AiFillDelete className="delete-icon" onClick={() => deleteComment(singleComment.commentId)} />}
			</div>
			<div className="comment-container">
				<p>{singleComment.comment}</p>
			</div>
		</div>
	);
}

export default SingleComment;
