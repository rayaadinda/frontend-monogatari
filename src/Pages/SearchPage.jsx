import { useParams } from "react-router-dom"
import InPagenavigation from "../components/inPageNavigation"
import { useState, useEffect } from "react"
import Loader from "../components/loader"
import MobileCard from "../components/mobileCard"
import UserCard from "../components/UserCard" // Impor UserCard
import Animation from "../common/pageAnimation"
import NoDataMessage from "../components/NoDataComponent"
import axios from "axios"

const SearchPage = () => {
	let { query } = useParams()
	let [blogs, setBlogs] = useState(null)
	let [users, setUsers] = useState(null) // State untuk pengguna
	let [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchSearchResults = async () => {
			setLoading(true)
			try {
				// Fetch blog results
				const blogResponse = await axios.post(
					`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`,
					{ tag: query }
				)
				setBlogs(blogResponse.data)

				// Fetch user results
				const userResponse = await axios.post(
					`${import.meta.env.VITE_SERVER_DOMAIN}/search-users`,
					{ query } // Menggunakan query yang benar
				)
				setUsers(userResponse.data)
			} catch (error) {
				console.error("Error fetching search results:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchSearchResults()
	}, [query])

	return (
		<section className="h-cover flex justify-center gap-10">
			<div className="w-full">
				<InPagenavigation
					routes={[`Search Results for "${query}"`, "Account Matched"]}
					defaultHidden={["Accounts Matched"]}
				>
					<>
						{loading ? (
							<Loader />
						) : (
							<>
								{/* Menampilkan hasil blog */}
								{blogs && blogs.length ? (
									blogs.map((blog, i) => (
										<Animation
											transition={{ duration: 1, delay: i * 0.1 }}
											key={blog.blog_id}
										>
											<MobileCard
												content={blog}
												author={blog.author.personal_info}
											/>
										</Animation>
									))
								) : (
									<NoDataMessage message="No Blogs Found" />
								)}

								{/* Menampilkan hasil pengguna */}
								{users && users.length ? (
									<div>
										<h2 className="font-medium text-xl mb-4">
											Account Matched
										</h2>
										{users.map((user, i) => (
											<Animation
												transition={{ duration: 1, delay: i * 0.1 }}
												key={user.personal_info.username} // Gunakan username sebagai key
											>
												<UserCard user={user} />
											</Animation>
										))}
									</div>
								) : (
									<NoDataMessage message="No Users Found" />
								)}
							</>
						)}
					</>
				</InPagenavigation>
			</div>
		</section>
	)
}

export default SearchPage
