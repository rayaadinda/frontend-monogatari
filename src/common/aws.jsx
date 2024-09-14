import axios from "axios"

export const getImageUploadURL = async (img) => {
	let imgUrl = null

	await axios
		.get(import.meta.env.VITE_SERVER_DOMAIN + "/image-upload-url")
		.then(async ({ data: { uploadURL } }) => {
			await axios({
				method: "PUT",
				url: uploadURL,
				headers: {
					"Content-Type": "image/jpeg",
				},
				data: img,
			}).then(() => {
				imgUrl = uploadURL.split("?")[0]
			})
		})

	return imgUrl
}
