export const validateUsername = (username) => {
	const regex = /^[a-zA-Z0-9_]{6,}$/;
	if (!regex.test(username)) {
		return 'Minimum 6 letters,only alphabets,numbers and "_"';
	}
	return "";
};

export const validateEmail = (email) => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!regex.test(email)) {
		return "Invalid email address.";
	}
	return "";
};

export const validatePassword = (password) => {
	const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
	if (!regex.test(password)) {
		return " at least 8 characters, one capital letter, one number, and one special symbol.";
	}
	return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
	if (confirmPassword !== password) {
		return "Passwords do not match.";
	}
	return "";
};
