import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CardBlog from "./CardBlog"
import OkinawaCard from "./OkinawaCard"
import MobileHeroCard from "./MobileHeroCard"
import { blogPosts } from "../data/blogData"
import InPagenavigation, { activeTabRef } from "./inPageNavigation"
import Animation from "../common/pageAnimation"
import axios from "axios"
import Loader from "./loader"
import MobileCard from "./mobileCard"
import MinimalBlog from "./MinimalBlog"
import NoDataMessage from "./NoDataComponent"

const homePage = () => {
	let [blogs, setBlogs] = useState(null)
	let [trendingBlogs, setTrendingBlogs] = useState(null)
	let [pageState, setPageState] = useState("Home")
	let [currentPage, setCurrentPage] = useState(1)
	let [itemsPerPage] = useState(7)

	let categories = [
		"All",
		"Travel",
		"Food",
		"Culture",
		"History",
		"Nature",
		"Anime",
	]

	const fetcLatestBlogs = () => {
		axios
			.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
			.then(({ data }) => {
				setBlogs(data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const fetchBlogsByCategory = () => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
				tag: pageState,
			})
			.then(({ data }) => {
				setBlogs(data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const fetcTrendingBlogs = () => {
		axios
			.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
			.then(({ data }) => {
				setTrendingBlogs(data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const loadBlogsByCategory = (e) => {
		let category = e.target.innerText.toLowerCase()
		setBlogs(null)

		if (pageState === category) {
			setPageState("Home")
			return
		}
		setPageState(category)
	}

	const paginate = (items, currentPage, itemsPerPage) => {
		const startIndex = (currentPage - 1) * itemsPerPage
		return items.slice(startIndex, startIndex + itemsPerPage)
	}

	const loadMoreBlogs = () => {
		setCurrentPage((prevPage) => prevPage + 1)
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
	}

	const paginatedBlogs = paginate(blogs || [], currentPage, itemsPerPage)
	const hasMoreBlogs = blogs && currentPage * itemsPerPage < blogs.length

	useEffect(() => {
		activeTabRef.current.click()

		if (pageState === "Home") {
			fetcLatestBlogs()
		} else {
			fetchBlogsByCategory()
		}

		if (!trendingBlogs) {
			fetcTrendingBlogs()
		}
	}, [pageState])

	return (
		<Animation>
			<div className="block sm:hidden p-4">
				{blogPosts.map((post) => (
					<MobileHeroCard key={post.id} post={post} />
				))}
			</div>
			<div className="hidden sm:block mt-10">
				<MainContent />
			</div>
			<section className="h-cover flex justify-center gap-6">
				<div className="w-full">
					<InPagenavigation
						routes={[pageState, "Trending"]}
						defaultHidden={["Trending"]}
					>
						<>
							{blogs == null ? (
								<Loader />
							) : paginatedBlogs.length ? (
								paginatedBlogs.map((blog, i) => {
									return (
										<Animation
											transition={{ duration: 1, delay: i * 0.1 }}
											key={i}
										>
											<MobileCard
												content={blog}
												author={blog.author.personal_info}
											/>
										</Animation>
									)
								})
							) : (
								<NoDataMessage message="No Blogs Published" />
							)}
							<Animation>
								{hasMoreBlogs && (
									<div className="flex justify-center w-full mt-4">
										<button
											onClick={loadMoreBlogs}
											className="rounded-lg bg-grey py-2 px-2"
										>
											Load More
										</button>
									</div>
								)}
							</Animation>
						</>

						{trendingBlogs == null ? (
							<Loader />
						) : (
							trendingBlogs.map((blog, i) => {
								return (
									<Animation
										transition={{ duration: 1, delay: i * 0.1 }}
										key={i}
									>
										<MinimalBlog blog={blog} index={i} />
									</Animation>
								)
							})
						)}
					</InPagenavigation>
				</div>

				{/* Tombol Load More */}

				<div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
					<div className="flex flex-col gap-10">
						<div>
							<h1 className="font-medium text-xl mb-8">
								Stories from all interest
							</h1>
							<div className="flex gap-3 flex-wrap">
								{categories.map((category, i) => {
									return (
										<button
											onClick={loadBlogsByCategory}
											className={
												"tag " +
												(pageState === category.toLowerCase()
													? " bg-black text-white "
													: " ")
											}
											key={i}
										>
											{category}
										</button>
									)
								})}
							</div>
						</div>

						<div>
							<h1 className="font-medium text-xl mb-8">
								Trending <i className="fi fi-rr-arrow-trend-up"></i>
							</h1>
							{trendingBlogs == null ? (
								<Loader />
							) : (
								trendingBlogs.map((blog, i) => {
									return (
										<Animation
											transition={{ duration: 1, delay: i * 0.1 }}
											key={i}
										>
											<MinimalBlog blog={blog} index={i} />
										</Animation>
									)
								})
							)}
						</div>
					</div>
				</div>
			</section>
		</Animation>
	)
}

const MainContent = () => (
	<div className="h-500">
		<motion.div
			className="flex flex-col sm:flex-row justify-center gap-6 mb-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2, duration: 0.5 }}
		>
			<CardBlog />
			<OkinawaCard />
		</motion.div>
	</div>
)

export default homePage
