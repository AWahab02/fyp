import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		// firstName: "",
		// lastName: "",
		email: "",
		username: "",
		password: "",
		library_books: [
			{ title: "Book 1", author: "Author 1", filename: "abc" },
			{ title: "Book 2", author: "Author 2", filename: "Abd" },
		],
	});	
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users";
			const { data: res } = await axios.post(url, data);
			console.log(res);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};


	return (
		<div className={styles.container}>
			<div className={styles.topLeftContainer}>
				<img src={require('./book2life_logo.png')} alt="" />
			</div>

			<form className={styles.signUpPanel} onSubmit={handleSubmit}>
				{/* Left Column */}
				<div className={styles.leftColumn}>
					<h2>signup!</h2>
					<h3>create an {<br />} account today {<br />}- for free!</h3>
				</div>

				{/* Right Column */}
				<div className={styles.rightColumn}>
					<div className={styles.inputGroup3}>
						<input type="email" name="email" placeholder="e-mail" onChange={handleChange} value={data.email} required />
					</div>
					<div className={styles.inputGroup1}>
						<input type="text" name="username" placeholder="username" onChange={handleChange} value={data.username} required />
					</div>
					<div className={styles.inputGroup2}>
						<input type="password" name="password" placeholder="password" onChange={handleChange} value={data.password} required />
					</div>

					{error && <div className={styles.error_msg}>{error}</div>}
					<button type="submit" className={styles.signUpButton}>signup!</button>
				</div>

			</form>
		</div>
	);
};

export default Signup;