import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { blogPosts } from "../data/blogData"

const OkinawaCard = () => {
	const navigate = useNavigate()
	const post = blogPosts.find((post) => post.id === "okinawa")

	const handleClick = () => navigate("../Pages/NotFound.jsx")

	return (
		<motion.div
			onClick={handleClick}
			className="card bg-base-100 shadow-xl w-full max-w-[398px] overflow-hidden cursor-pointer"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<motion.figure
				className="w-full h-48 sm:h-56 md:h-64"
				whileHover={{ scale: 1.1 }}
				transition={{ duration: 0.2 }}
			>
				<img
					src={post.image}
					alt={post.title}
					className="w-full h-full object-cover outline-black"
					loading="lazy"
				/>
			</motion.figure>
			<motion.div
				className="card-body bg-blue text-white p-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1, duration: 0.3 }}
			>
				<h2 className="card-title text-xl sm:text-2xl text-black font-inter mb-2">
					{post.title}
				</h2>
				<p className="text-sm sm:text-base text-black font-inter font-medium">
					{post.content}
				</p>
			</motion.div>
		</motion.div>
	)
}

export default React.memo(OkinawaCard)
