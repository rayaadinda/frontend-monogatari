import { useParams } from "react-router-dom"
import NotFound from "./NotFound"

const ProfilePage = () => {
	let { id: profileId } = useParams()

	return <NotFound />
}

export default ProfilePage
