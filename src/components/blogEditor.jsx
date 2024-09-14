import { Link, useNavigate } from "react-router-dom"
import logo from "/assets/favicon.png"
import Animation from "../common/pageAnimation"
import uploadBanner from "/assets/uploadbanner.png"
import { getImageUploadURL } from "../common/aws"
import { useContext, useEffect } from "react"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../Pages/editorPage"
import EditorJS from "@editorjs/editorjs"
import { tools } from "./toolsComponent"
import axios from "axios"
import { UserContext } from "../App"

const BlogEditor = () => {
	let {
		blog,
		blog: { title, banner, content, tags, des },
		setBlog,
		textEditor,
		setTextEditor,
		setEditorState,
	} = useContext(EditorContext)

	let {
		userAuth: { access_token },
	} = useContext(UserContext)

	let navigate = useNavigate()

	useEffect(() => {
		if (!textEditor.isReady) {
			setTextEditor(
				new EditorJS({
					holder: "textEditor",
					data: content,
					tools: tools,
					placeholder: "Start writing your blog...",
				})
			)
		}
	}, [])

	const handleTitleKeyDown = (e) => {
		if (e.keyCode == 13) {
			e.preventDefault()
		}
	}

	const handleTitleChange = (e) => {
		let input = e.target
		input.style.height = "auto"
		input.style.height = input.scrollHeight + "px"

		setBlog({ ...blog, title: input.value })
	}

	const handleBannerUpload = (e) => {
		let img = e.target.files[0]

		if (img) {
			let loadingToast = toast.loading("Uploading Image...")
			getImageUploadURL(img)
				.then((url) => {
					if (url) {
						toast.dismiss(loadingToast)
						toast.success("Image Uploaded Successfully")
						setBlog({ ...blog, banner: url })
					}
				})
				.catch((err) => {
					toast.dismiss(loadingToast)
					toast.error(err)
				})
		}
	}

	const handleBannerError = (e) => {
		let img = e.target
		img.src = uploadBanner
	}

	const handlePublishEvent = () => {
		if (!title.length) {
			toast.error("Please enter a title")
			return
		}

		if (!banner.length) {
			toast.error("Please upload a banner")
			return
		}

		if (!textEditor.isReady) {
			toast.error("Please wait while we save your blog")
			return
		}

		if (textEditor.isReady) {
			textEditor.save().then((data) => {
				if (data.blocks.length) {
					setBlog({ ...blog, content: data })
					setEditorState("publish")
				} else {
					toast.error("Please add some content to your blog")
				}
			})
		}
	}

	const handleSaveDraft = (e) => {
		if (e.target.className.includes("disable")) {
			return
		}

		if (!title.length) {
			return toast.error("write blog title before save draft")
		}

		let loadingToast = toast.loading("Saving Draft...")

		e.target.classList.add("disable")

		if (textEditor.isReady) {
			textEditor.save().then((content) => {
				let blogObj = {
					title,
					banner,
					des,
					tags,
					content,
					draft: true,
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
						toast.success("Draft Saved Successfully")

						setTimeout(() => {
							navigate("/")
						}, 500)
					})
					.catch(({ response }) => {
						e.target.classList.remove("disable")
						toast.dismiss(loadingToast)

						return toast.error(response.data.error)
					})
			})
		}
	}

	return (
		<>
			<nav className="navbar">
				<Link to="/">
					<img src={logo} alt="logo" className="flex-none w-14 p-2" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1">
					{title.length ? title : "New Blog"}
				</p>

				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2" onClick={handlePublishEvent}>
						Publish
					</button>
					<button className="btn-light py-2" onClick={handleSaveDraft}>
						Save Draft
					</button>
				</div>
			</nav>
			<Toaster />
			<Animation>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video bg-white border-4 rounded-lg border-grey ">
							<label htmlFor="uploadBanner">
								<img
									src={banner}
									onError={handleBannerError}
									alt="upload banner"
									className="cursor-pointer z-20"
								/>
								<input
									type="file"
									id="uploadBanner"
									accept="png,jpg,jpeg"
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>

						<textarea
							defaultValue={title}
							placeholder="Blog Title"
							className=" text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}
						></textarea>

						<hr className="w-full opacity-10 my-5 "></hr>

						<div id="textEditor" className="font-gelasio"></div>
					</div>
				</section>
			</Animation>
		</>
	)
}

export default BlogEditor
