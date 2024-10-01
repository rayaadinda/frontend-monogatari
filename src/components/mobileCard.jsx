import { useNavigate } from "react-router-dom"
import { getDay } from "../common/date"
import { motion } from "framer-motion"

const MobileCard = ({ content, author }) => {
	const navigate = useNavigate()

	const handleClick = () => navigate(`/blog/${id}`)

	let {
		publishedAt,
		title,
		tags,
		banner,
		des,
		blog_id: id,
		activity: { total_likes },
	} = content
	let { fullname, profile_img, username } = author

	return (
		<motion.div
			onClick={handleClick}
			className=" bg-white shadow-lg rounded-lg p-4 flex flex-col items-start mt-4 mb-4 cursor-pointer    "
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center mb-2">
				<img
					src={profile_img}
					alt="Author Avatar"
					className="w-8 h-8 rounded-full mr-2"
				/>
				<div>
					<p className="text-xl font-semibold mr-4">
						@{username}{" "}
						<span className="text-base font-normal">{getDay(publishedAt)}</span>
					</p>
					<p className="text-sm text-gray-500">in Jakarta</p>
				</div>
			</div>
			<h2 className="font-gelasio font-medium mb-2">{title}</h2>
			<p className="text-sm text-gray-700 mb-2">{des}</p>
			<img src={banner} className="aspect-video rounded-lg mb-2" />
			<div className="flex items-center text-xs text-gray-500">
				<span className="flex items-center gap-2">
					<i className="fi fi-rr-heart text-lg"></i>
					{total_likes}
					<span className=" text-lg py-1 px-4">{tags[0]} </span>
				</span>
			</div>
		</motion.div>
	)
}

export default MobileCard
