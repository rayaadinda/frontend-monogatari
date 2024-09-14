import { createContext, useContext } from "react"
import { UserContext } from "../App"
import { Navigate } from "react-router-dom"
import { useState } from "react"
import PublishForm from "../components/publishForm"
import BlogEditor from "../components/blogEditor"

const BlogStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	des: "",
	author: { personal_info: {} },
}

export const EditorContext = createContext({})

const EditorPage = () => {
	const [blog, setBlog] = useState(BlogStructure)
	const [editorState, setEditorState] = useState("editor")
	const [textEditor, setTextEditor] = useState({
		isReady: false,
	})

	let {
		userAuth: { access_token },
	} = useContext(UserContext)

	return (
		<EditorContext.Provider
			value={{
				blog,
				setBlog,
				editorState,
				setEditorState,
				textEditor,
				setTextEditor, // Pastikan ini benar
			}}
		>
			{access_token === null ? (
				<Navigate to="/signIn" />
			) : editorState == "editor" ? (
				<BlogEditor />
			) : (
				<PublishForm />
			)}
		</EditorContext.Provider>
	)
}

export default EditorPage
