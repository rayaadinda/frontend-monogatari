import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [headerPhotoPreviewUrl, setHeaderPhotoPreviewUrl] = useState(null)
  const { id: profileId, username: profileUsername } = useParams()
  const navigate = useNavigate()
  const { userAuth, setUserAuth } = useContext(UserContext)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    social_links: {
      twitter: "",
      instagram: "",
      facebook: "",
      github: "",
      website: "",
    },
  })

  useEffect(() => {
    console.log("User Auth:", userAuth)
    console.log("Profile ID:", profileId)
    fetchProfile(profileId || userAuth._id)
  }, [profileId, userAuth._id])

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/profile/${id}`)
      console.log("Profile Data:", response.data)
      setProfile(response.data)
      setFormData({
        username: response.data.personal_info.username,
        email: response.data.personal_info.email,
        bio: response.data.personal_info.bio || "",
        social_links: response.data.personal_info.social_links || {
          twitter: "",
          instagram: "",
          facebook: "",
          github: "",
          website: "",
        },
      })
      setPreviewUrl(response.data.personal_info.profile_img)
      setHeaderPhotoPreviewUrl(response.data.personal_info.header_img)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    const loadingToast = toast.loading("Updating profile picture...")

    try {
      const urlResponse = await axios.get("http://localhost:3000/image-upload-url", {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
        },
      })

      const { uploadURL, imageUrl } = urlResponse.data

      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      })

      const response = await axios.post(
        "http://localhost:3000/update-profile-image",
        { profileImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )

      if (response.data.success) {
        setPreviewUrl(imageUrl)
        setUserAuth((prev) => ({
          ...prev,
          profile_img: imageUrl,
        }))
        const sessionUser = JSON.parse(sessionStorage.getItem("user"))
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            ...sessionUser,
            profile_img: imageUrl,
          })
        )

        toast.success("Profile picture updated successfully", {
          id: loadingToast,
        })
        fetchProfile(profileId || userAuth._id)
      } else {
        throw new Error(response.data.error || "Failed to update profile picture")
      }
    } catch (err) {
      console.error("Profile picture update error:", err)
      toast.error(err.response?.data?.error || "Failed to update profile picture", {
        id: loadingToast,
      })
    }
  }

  const handleHeaderPhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    const loadingToast = toast.loading("Updating header photo...")

    try {
      const urlResponse = await axios.get("http://localhost:3000/image-upload-url", {
        headers: {
          Authorization: `Bearer ${userAuth.access_token}`,
        },
      })

      const { uploadURL, imageUrl } = urlResponse.data

      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
      })

      const response = await axios.post(
        "http://localhost:3000/update-header-image",
        { headerImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )

      if (response.data.success) {
        setHeaderPhotoPreviewUrl(imageUrl)
        setUserAuth((prev) => ({
          ...prev,
          header_img: imageUrl,
        }))
        const sessionUser = JSON.parse(sessionStorage.getItem("user"))
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            ...sessionUser,
            header_img: imageUrl,
          })
        )

        toast.success("Header photo updated successfully", {
          id: loadingToast,
        })
        fetchProfile(profileId || userAuth._id)
      } else {
        throw new Error(response.data.error || "Failed to update header photo")
      }
    } catch (err) {
      console.error("Header photo update error:", err)
      toast.error(err.response?.data?.error || "Failed to update header photo", {
        id: loadingToast,
      })
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth.access_token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success("Profile updated successfully")
        fetchProfile(profileId || userAuth._id)
      } else {
        throw new Error(response.data.error || "Failed to update profile")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      toast.error(err.response?.data?.error || "Failed to update profile")
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header Photo */}
        <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-900" style={{ backgroundImage: `url(${headerPhotoPreviewUrl || profile?.personal_info?.header_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Info Section */}
          <div className="relative -mt-24">
            <div className="flex flex-col space-y-4">
              {/* Profile Picture and Edit Button */}
              <div className="flex justify-between items-start">
                <div className="relative">
                  <img
                    src={previewUrl || profile?.personal_info?.profile_img}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-white object-cover"
                  />
                </div>
                {userAuth && profile && (userAuth._id === profile._id) && (
                  <Dialog>
                     <DialogTrigger asChild>
       					 <Button variant="outline">Edit Profile</Button>
      					</DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-base font-bold">Edit Profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">

                        {/* Profile Picture Section */}
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            <img
                              src={previewUrl || profile?.personal_info?.profile_img}
                              alt="Profile Preview"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <Input 
                              type="file" 
                              className="flex-1" 
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </div>
                        </div>

                        {/* Profile Info */}
                        <div className="grid gap-2">
                          <label htmlFor="username" className="text-sm font-medium">Username</label>
                          <input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          />
                        </div>

                        <div className="grid gap-2">
                          <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          />
                        </div>

                        {/* Social Links */}
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Social Links</label>
                          <input
                            name="social_links.github"
                            placeholder="GitHub"
                            value={formData.social_links.github}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          />
                          <input
                            name="social_links.website"
                            placeholder="Personal Website"
                            value={formData.social_links.website}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <button
                          onClick={handleSubmit}
                          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          Save Changes
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Profile Info */}
              <div>
                {/* Username */}
                <h1 className="text-2xl font-bold">{profile?.personal_info?.username}</h1>
				<div className="text-gray-600 text-xl mb-4">{profile?.personal_info?.email}</div>

                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-base">
                  <span><span className="font-semibold">{profile?.account_info?.followers?.length || 0}</span> Followers</span>
                  <span><span className="font-semibold">{profile?.account_info?.following?.length || 0}</span> Following</span>
                  <span>Joined {new Date(profile?.personal_info?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>

                {/* Email */}
               
                {/* Bio */}
                <div className="mt-2">{profile?.personal_info?.bio}</div>

                {/* Social Links */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold mb-4">Social Links</h4>
                  <div className="space-y-2">
                    {Object.entries(profile?.personal_info?.social_links || {}).map(([platform, url]) => 
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-500 hover:underline"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
