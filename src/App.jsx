import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import UserAuthForm from "./Pages/userAuthForm"
import { createContext, useState, useEffect } from "react"
import { lookInSession } from "./common/session"
import Editor from "./Pages/editorPage"
import Blog from "./components/Blog" // Impor komponen Blog
import BlogPost from "./components/BlogPost" // Impor komponen BlogPost
import SearchPage from "./Pages/SearchPage"
import SearchUserPage from "./Pages/SearchUserPage" // Impor SearchUserPage
import NotFound from "./Pages/NotFound"
import ProfilePage from "./Pages/ProfilePage"

export const UserContext = createContext({})

const App = () => {
	const [userAuth, setUserAuth] = useState({})

	useEffect(() => {
		let userInSession = lookInSession("user")

		userInSession
			? setUserAuth(JSON.parse(userInSession))
			: setUserAuth({ access_token: null })
	}, [])

	return (
		<UserContext.Provider value={{ userAuth, setUserAuth }}>
			<Routes>
				<Route path="/editor" element={<Editor />} />
				<Route path="/" element={<Navbar />}>
					<Route index element={<Blog />} />
					<Route path="/signIn" element={<UserAuthForm type="signIn" />} />
					<Route path="/signUp" element={<UserAuthForm type="signUp" />} />
					<Route path="/search/:query" element={<SearchPage />} />
					<Route path="/user/:username" element={<ProfilePage />} />
					<Route path="/blog" element={<Blog />} />
					<Route path="/blog/:id" element={<BlogPost />} />
					<Route
						path="/search-users/:query"
						element={<SearchUserPage />}
					/>{" "}
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</UserContext.Provider>
	)
}

export default App
