import React from "react"
import Layout from "/components/layout/Layout"
import BlogList from "../components/blog/BlogList"
import useBlogData from "../hooks/useBlogData"

const BlogPage = () => {
	const { blogs, loading, error } = useBlogData()

	if (loading) return <div>Memuat...</div>
	if (error) return <div>Error: {error.message}</div>

	return (
		<Layout>
			<h1 className="text-4xl font-bold mb-8">Blog</h1>
			<BlogList blogs={blogs} />
		</Layout>
	)
}

export default BlogPage
