import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/main";
import Signup from "./components/signup";
import Login from "./components/login";
import Upload from "./components/upload/Upload";
import GetFiles from "./components/getfiles/GetFiles";
import UserProfile from "./components/profile/profile";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Login />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/upload" exact element={<Upload />} />
			<Route path="/get-files" exact element={<GetFiles />} />
			<Route path="/profile" exact element={<UserProfile />} />
		</Routes>
	);
}

export default App;