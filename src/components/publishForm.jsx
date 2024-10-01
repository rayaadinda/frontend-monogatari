import { Toaster, toast } from "react-hot-toast"
import Animation from "../common/pageAnimation"
import { useContext } from "react"
import { EditorContext } from "../Pages/editorPage"
import Tag from "./tagsComponent"
import axios from "axios"
import { UserContext } from "../App"
import { useNavigate } from "react-router-dom"

const PublishForm = () => {
	let charLimit = 200
	let tagLimit = 10

	let {
		blog,
		blog: { banner, title, tags, des, content },
		setEditorState,
		setBlog,
	} = useContext(EditorContext)

	let {
		userAuth: { access_token },
	} = useContext(UserContext)

	let navigate = useNavigate()

	const handleClose = () => {
		setEditorState("editor")
	}

	const handleBlogTitle = (e) => {
		let input = e.target
		setBlog({ ...blog, title: input.value })
	}

	const handleBlogDes = (e) => {
		let input = e.target
		setBlog({ ...blog, des: input.value })
	}

	const handleTitleKeyDown = (e) => {
		if (e.keyCode == 13) {
			e.preventDefault()
		}
	}

	const handleKeyDown = (e) => {
		if (e.keyCode == 13 || e.keyCode == 188) {
			e.preventDefault()

			let tag = e.target.value.trim()
			// Remove any "#" at the beginning of the tag
			tag = tag.replace(/^#/, "")

			if (tags.length < tagLimit) {
				if (!tags.includes(tag) && tag.length) {
					setBlog({ ...blog, tags: [...tags, tag] })
				}
			} else {
				toast.error(`You can only add ${tagLimit} Tags`)
			}

			e.target.value = ""
		}
	}

	const publishBlog = (e) => {
		if (e.target.className.includes("disable")) {
			return
		}

		if (!title.length) {
			return toast.error("write blog title before publish")
		}

		if (!banner.length) {
			return toast.error("Please upload a banner image")
		}

		let loadingToast = toast.loading("Publishing...")

		e.target.classList.add("disable")

		let blogObj = {
			title,
			banner,
			des,
			tags,
			content,
			draft: false,
		}

		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then(() => {
				e.target.classList.remove("disable")

				toast.dismiss(loadingToast)
				toast.success("Published Successfully")

				setTimeout(() => {
					navigate("/blog")
				}, 500)
			})
			.catch(({ response }) => {
				e.target.classList.remove("disable")
				toast.dismiss(loadingToast)

				return toast.error(response.data.error)
			})
	}

	return (
		<Animation>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
				<Toaster />

				<button
					className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
					onClick={handleClose}
				>
					<i className="fi fi-br-cross"></i>
				</button>

				<div className="max-w-[550px] center">
					<p className="text-dark-grey mb-1">Preview</p>

					<div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
						<img src={banner} alt="" />
					</div>
					<h1 className="text-4xl font-medium mt-4 leading-tight line-clamp-2 ">
						{title}
					</h1>

					<p className="font-gelasio mt-4 line-clamp-2 leading-relaxed">
						{des}
					</p>
				</div>

				<div className="border-grey lg:border-1 ">
					<p className="text-dark-grey mb-2 mt-9">Blog Title</p>
					<input
						type="text"
						placeholder="Blog Title"
						defaultValue={title}
						className="input-box pl-4"
						onChange={handleBlogTitle}
					/>
					<p className="text-dark-grey mb-2 mt-9">
						Short description (Optional)
					</p>

					<textarea
						maxLength={charLimit}
						placeholder="Short description"
						defaultValue={des}
						className="h-40 resize-none input-box pl-4 leading-7 input-box"
						onChange={handleBlogDes}
						onKeyDown={handleTitleKeyDown}
					></textarea>

					<p className="text-dark-grey mt-2 text-sm text-right">
						{charLimit - des.length} characters left
					</p>

					<p>Topics - (Optional) (Dont Use "#") </p>

					<div className="relative input-box pl-2 py-2 pb-4">
						<input
							type="text"
							placeholder="Topics"
							className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
							onKeyDown={handleKeyDown}
						/>
						{tags.map((tag, i) => {
							return <Tag tag={tag} tagIndex={i} key={i} />
						})}
					</div>
					<p className=" mt-1 mb-4 text-dark-grey text-sm text-right">
						{tagLimit - tags.length} Tags left
					</p>

					<button className="btn-dark px-8" onClick={publishBlog}>
						Publish
					</button>
				</div>
			</section>
		</Animation>
	)
}

export default PublishForm
