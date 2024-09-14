import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const UserCard = ({ user }) => {
	const navigate = useNavigate()

	const handleClick = () => navigate(`/user/${user.personal_info.username}`)

	const {
		fullname = "Unknown",
		username,
		profile_img,
	} = user.personal_info || {}

	return (
		<motion.div
			onClick={handleClick}
			className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-start mt-4 mb-4 cursor-pointer"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center mb-2">
				<img
					src={profile_img}
					alt="User Avatar"
					className="w-8 h-8 rounded-full mr-2"
				/>
				<div>
					<p className="text-sm font-semibold">@{username}</p>
					<p className="text-sm text-gray-500">{fullname}</p>
				</div>
			</div>
			<p className="text-sm text-gray-700 mb-2">
				{user.bio || "No bio available"}
			</p>
		</motion.div>
	)
}

export default UserCard
