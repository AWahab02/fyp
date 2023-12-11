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
			{ title: "Book 1", author: "Author 1", pages: "200" },
			{ title: "Book 2", author: "Author 2", pages: "150" },
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
			console.log(data);
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

	// const handleBookChange = (index, property, value) => {
	// 	const updatedBooks = [...data.books];
	// 	updatedBooks[index] = { ...updatedBooks[index], [property]: value };
	// 	setData({ ...data, books: updatedBooks });
	//   };

	//   const addBook = () => {
	// 	setData({
	// 	  ...data,
	// 	  books: [...data.books, { title: "", author: "", pages: "" }],
	// 	});
	//   };

	//   const removeBook = (index) => {
	// 	const updatedBooks = [...data.books];
	// 	updatedBooks.splice(index, 1);
	// 	setData({ ...data, books: updatedBooks });
	//   };


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

					<div className={styles.booksContainer}>
						<h3>Your Books</h3>
						{data.library_books.map((book, index) => (
							<div key={index} className={styles.bookInputGroup}>
								<input
									type="text"
									placeholder="Title"
									name={`library_books[${index}].title`}
									value={book.title}
									readOnly // Make the input read-only
								/>
								<input
									type="text"
									placeholder="Author"
									name={`library_books[${index}].author`}
									value={book.author}
									readOnly
								/>
								<input
									type="text"
									placeholder="Pages"
									name={`library_books[${index}].pages`}
									value={book.pages}
									readOnly
								/>
							</div>
						))}
					</div>

					{error && <div className={styles.error_msg}>{error}</div>}
					<button type="submit" className={styles.signUpButton}>signup!</button>
				</div>

			</form>
		</div>
	);
};

export default Signup;