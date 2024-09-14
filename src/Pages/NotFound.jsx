import React from "react"
import { Link } from "react-router-dom"

const NotFound = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl text-center font-bold">404 - Page Not Found</h1>
			<p className="mt-4 text-lg text-medium">
				Sorry, the page you are looking is under development
			</p>
			<Link to="/" className="mt-6 text-blue-500 hover:underline">
				Go back to Home
				<hr></hr>
			</Link>
		</div>
	)
}

export default NotFound
