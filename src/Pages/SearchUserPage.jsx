import { useParams } from "react-router-dom"
import InPagenavigation from "../components/inPageNavigation"
import { useState, useEffect } from "react"
import Loader from "../components/loader"
import UserCard from "../components/UserCard"
import Animation from "../common/pageAnimation"
import NoDataMessage from "../components/NoDataComponent"
import axios from "axios"

const SearchUserPage = () => {
	let { query } = useParams()
	let [users, setUsers] = useState(null)
	let [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchSearchResults = async () => {
			setLoading(true)
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_SERVER_DOMAIN}/search-users}`,
					{ username: query }
				)
				setUsers(response.data)
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
				>
					<>
						{loading ? (
							<Loader />
						) : users && users.length ? (
							<div>
								<h2 className="font-medium text-xl mb-4">Account Matched</h2>
								{users.map((user, i) => (
									<Animation
										transition={{ duration: 1, delay: i * 0.1 }}
										key={user.id}
									>
										<UserCard user={user} />
									</Animation>
								))}
							</div>
						) : (
							<NoDataMessage message="No Users Found" />
						)}
					</>
				</InPagenavigation>
			</div>
		</section>
	)
}

export default SearchUserPage
