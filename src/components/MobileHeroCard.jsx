import React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const MobileHeroCard = ({ post }) => {
	const navigate = useNavigate()

	const handleClick = () => navigate(`/blog/${post.id}`)

	return (
		<motion.div
			onClick={handleClick}
			className="mobile-hero-card bg-white shadow-lg rounded-lg p-4 flex flex-col items-start mt-4 mb-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center mb-2">
				<img
					src="/assets/avatar.jpg"
					alt="Author Avatar"
					className="w-8 h-8 rounded-full mr-2"
				/>
				<div>
					<p className="text-sm font-semibold">{post.author}</p>
					<p className="text-xs text-gray-500">in Jakarta</p>
				</div>
			</div>
			<h2 className="text-lg font-bold mb-2">{post.title}</h2>
			<p className="text-sm text-gray-700 mb-2">{post.content}</p>
			<img
				src={post.image}
				alt={post.title}
				className="w-full h-64 object-cover rounded-lg mb-2"
			/>
			<div className="flex items-center text-xs text-gray-500">
				<span className="mr-2">{post.date}</span>
			</div>
		</motion.div>
	)
}

export default MobileHeroCard
