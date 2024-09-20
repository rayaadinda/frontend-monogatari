import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import axios from "axios"
import Loader from "./loader"
import { getDay } from "../common/date" // Adjusted import for named export
import { calculateMinReadTime } from "../utils/readTime" // Impor fungsi
import { useContext } from "react"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

const BlogPost = () => {
	const { id } = useParams()
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	})
	const [publishedAt, setPublishedAt] = useState(null)
	const { userAuth } = useContext(UserContext)
	const navigate = useNavigate()
	const [showDropdown, setShowDropdown] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleDeletePost = () => {
		if (!userAuth.access_token) {
			toast.error("You must be logged in to delete a post")
			return
		}
		setShowDeleteModal(true)
	}

	const confirmDeletePost = async () => {
		try {
			await axios.delete(
				`${import.meta.env.VITE_SERVER_DOMAIN}/delete-blog/${id}`,
				{
					headers: {
						Authorization: `Bearer ${userAuth.access_token}`,
					},
				}
			)
			toast.success("Blog post deleted successfully")
			navigate("/")
		} catch (error) {
			console.error("Error deleting blog post:", error)
			if (error.response && error.response.status === 403) {
				toast.error("You are not authorized to delete this blog post")
			} else {
				toast.error("An error occurred while deleting the blog post")
			}
		} finally {
			setShowDeleteModal(false)
		}
	}

	const variants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	}

	const minReadTime = post
		? calculateMinReadTime(
				post.content.map((item) =>
					item.blocks.map((block) => block.data.text).join(" ")
				)
		  )
		: 0 // Hitung waktu baca minimum jika post ada

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_SERVER_DOMAIN}/blog/${id}`
				)
				setPost(response.data)
				setPublishedAt(response.data.publishedAt) // Set publishedAt from the response
			} catch (error) {
				console.error("Error fetching post:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchPost()
	}, [id])

	if (loading) {
		return <Loader />
	}

	if (!post) {
		return <div>Post tidak ditemukan</div>
	}

	// Fungsi untuk merender konten
	const renderContent = (content) => {
		if (!content || !Array.isArray(content)) return null

		return content
			.flatMap((item) => {
				if (item.blocks && Array.isArray(item.blocks)) {
					return item.blocks.map((block, index) => {
						switch (block.type) {
							case "paragraph":
								return (
									<p
										key={block.id || index}
										className="mb-6 text-2xl leading-relaxed"
										dangerouslySetInnerHTML={{ __html: block.data.text }}
									/>
								)
							case "header":
								return (
									<h2
										key={block.id || index}
										className="text-3xl font-bold mb-4"
									>
										{block.data.text}
									</h2>
								)
							case "list":
								return (
									<ul key={block.id || index} className="list-disc pl-5 mb-6">
										{block.data.items.map((item, itemIndex) => (
											<li key={itemIndex}>{item}</li>
										))}
									</ul>
								)
							case "quote":
								return (
									<blockquote
										key={block.id || index}
										className="border-l-4 border-gray-500 pl-4 italic mb-6"
									>
										{block.data.text}
									</blockquote>
								)
							case "image":
								return (
									<img
										key={block.id || index}
										src={block.data.file.url}
										alt={block.data.caption || ""}
										className="w-full h-auto mb-4"
									/>
								)
							// Add more cases for other block types as needed
							default:
								return null
						}
					})
				}
				return null
			})
			.filter(Boolean)
	}

	return (
		<motion.article
			ref={ref}
			className="max-w-4xl mx-auto px-4 py-8"
			variants={variants}
			initial="hidden"
			animate={inView ? "visible" : "hidden"}
			transition={{ duration: 0.5 }}
		>
			<div className="">
				<motion.h2
					variants={variants}
					initial="hidden"
					animate={inView ? "visible" : "hidden"}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					{post.title}
				</motion.h2>
				<div className="flex max-sm:flex-col justify-between my-8 relative">
					<div className="flex gap-5 items-start">
						<img
							src={post.author.personal_info.profile_img}
							className="w-14 h-14 rounded-full"
						/>
						<p className="">
							<span className="underline capitalize">
								{post.author.personal_info.username}
							</span>{" "}
							<br />
							<span className="text-dark-grey">
								{minReadTime} min read · {getDay(publishedAt)}
							</span>{" "}
						</p>
					</div>
					{userAuth.username === post.author.personal_info.username && (
						<div className="absolute right-0 top-0">
							<button
								onClick={() => setShowDropdown(!showDropdown)}
								className="text-3xl focus:outline-none"
							>
								⋮
							</button>
							{showDropdown && (
								<div className="absolute right-0 mt-2 w-24 bg-white text-center rounded-md shadow-lg z-10">
									<button
										onClick={handleDeletePost}
										className="block font-medium px-2 text-red py-2 text-sm"
									>
										Delete Post
									</button>
									<button className="block font-medium px-2 py-2 text-sm">
										Edit Post
									</button>
								</div>
							)}
						</div>
					)}
				</div>
				<motion.img
					src={post.banner || post.image}
					alt={post.title}
					className="w-full h-96 object-cover mb-4"
					loading="lazy"
					variants={variants}
					initial="hidden"
					animate={inView ? "visible" : "hidden"}
					transition={{ delay: 0.4, duration: 0.5 }}
				/>
			</div>

			<motion.div
				className="prose lg:prose-xl blog-content"
				variants={variants}
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				transition={{ delay: 0.8, duration: 0.5 }}
			>
				{renderContent(post.content)}
			</motion.div>

			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg">
						<h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
						<p className="mb-4 text-center">
							Are you sure you want to delete this post?
						</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 bg-grey rounded-md"
							>
								Cancel
							</button>
							<button
								onClick={confirmDeletePost}
								className="px-4 py-2 bg-red text-white rounded-md"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</motion.article>
	)
}

export default React.memo(BlogPost)
