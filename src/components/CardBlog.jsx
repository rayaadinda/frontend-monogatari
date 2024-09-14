import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { blogPosts } from "../data/blogData"

const CardBlog = () => {
	const navigate = useNavigate()
	const post = blogPosts.find((post) => post.id === "frieren")

	const handleClick = () => {
		navigate("../Pages/NotFound.jsx")
	}

	return (
		<motion.div
			onClick={handleClick}
			className="card bg-black cursor-pointer shadow-xl overflow-hidden w-full max-w-[933px] flex flex-col sm:flex-row"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.img
				className="object-cover w-full sm:w-1/2 h-48 sm:h-auto rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none"
				src={post.image}
				alt={post.title}
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.3 }}
			/>
			<div className="card-body w-full sm:w-1/2 p-4">
				<motion.h1
					className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-inter font-medium mb-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					{post.title}
				</motion.h1>
				<motion.p
					className="text-sm sm:text-base md:text-lg lg:text-xl font-inter text-white"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					{post.content}
				</motion.p>
			</div>
		</motion.div>
	)
}

export default CardBlog
