import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import axios from "axios"
import Loader from "./loader"
import { getDay } from "../common/date" // Adjusted import for named export
import { calculateMinReadTime } from "../utils/readTime" // Impor fungsi

const BlogPost = () => {
	const { id } = useParams()
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	})
	const [publishedAt, setPublishedAt] = useState(null) // Add state for publishedAt

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
				<div className="flex max-sm:flex-col justify-between my-8">
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
		</motion.article>
	)
}

export default React.memo(BlogPost)
