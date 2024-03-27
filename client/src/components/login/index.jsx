import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", data.email);
			window.location = "/homepage";
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
		<div>
			<div className={styles.container}>
				<div className={styles.leftContainer}>
					{/* Content for the left container */}
				</div>

				<div className={styles.rightContainer}>
					<div className={styles.topRightContainer}>
						<img src={require('./book2life_logo.png')} alt="" />
					</div>
					<form className={styles.loginPanel} onSubmit={handleSubmit}>
						<h2>login!</h2>
						<div className={styles.inputGroup1}>
							<input type="email" name="email" placeholder="Username" onChange={handleChange} value={data.email} required />
						</div>
						<br />
						<div className={styles.inputGroup}>
							<input type="password" name="password" placeholder="Password" onChange={handleChange} value={data.password} required />
						</div>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.signInButton}>enter!</button>
						<p className="" >don't have an account?</p>
						<Link to="/signup">
							<button type="button" className={styles.signUpButton}>signup!</button>
						</Link>
						<br/>
					</form>
				</div>
			</div>
			{/* Other content */}
		</div>
	);
};

export default Login;