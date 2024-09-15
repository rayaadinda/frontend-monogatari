import { useContext, useRef } from "react"
import Animation from "../common/pageAnimation"
import { Link, Navigate, useNavigate } from "react-router-dom"
import InputBox from "../components/input"
import googleIcon from "/assets/google.png"
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"
import { storeInSession } from "../common/session"
import { UserContext } from "../App"
import { AuthWithGoogle } from "../common/firebase"

const UserAuthForm = ({ type }) => {
	const navigate = useNavigate()
	let {
		userAuth: { access_token },
		setUserAuth,
	} = useContext(UserContext)

	const userAuthThroughServer = (serverRoute, formdata) => {
		console.log("Attempting to authenticate...")
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formdata, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then(({ data }) => {
				storeInSession("user", JSON.stringify(data))
				setUserAuth(data)

				if (serverRoute === "/signUp") {
					toast.success("Signup successful! Welcome to our community.")
				} else {
					toast.success("Login successful! Welcome back.")
				}

				setTimeout(() => {
					navigate("/")
				}, 4000)
			})
			.catch((error) => {
				console.error("Error detail dari server:", error.response || error)
				if (error.response) {
					toast.error(error.response.data.error)
				} else {
					toast.error("An error occurred while connecting to the server")
				}
				console.error("Error:", error)
			})
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		let serverRoute = type === "signIn" ? "/signIn" : "/signUp"

		let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // regex for email
		let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/ // regex for password

		let form = new FormData(formElement)
		let formdata = {}

		for (let [key, value] of form.entries()) {
			formdata[key] = value
		}
		let { username, email, password } = formdata

		//form validation

		if (username) {
			if (username.length < 3) {
				return toast.error("Username must be at least 3 characters")
			}
		}

		if (!email.length) {
			return toast.error("Email is required")
		}

		if (!emailRegex.test(email)) {
			return toast.error("Email is not valid")
		}

		if (!passwordRegex.test(password)) {
			return toast.error(
				"Password should be 6 to 20 characters long with at least 1 number, 1 uppercase, and 1 lowercase letter"
			)
		}

		userAuthThroughServer(serverRoute, formdata)
	}

	//Google Auth
	const handleGoogleAuth = (e) => {
		e.preventDefault()

		AuthWithGoogle()
			.then(({ idToken }) => {
				let serverRoute = "/google-auth"

				let formdata = {
					idToken: idToken,
				}

				userAuthThroughServer(serverRoute, formdata)
			})
			.catch((err) => {
				console.error("Error detail:", err) // Tambahkan ini
				toast.error("Failed to login with Google: " + err.message)
				console.error(err)
			})
	}

	return access_token ? (
		<Navigate to="/" />
	) : (
		<Animation keyValue={type}>
			<section className="h-cover flex items-center justify-center">
				<Toaster />
				<form id="formElement" action="" className="w-[80%] max-w-[400px]">
					<h1 className="text-4xl font-bold mb-24 text-center">
						{type === "signIn" ? "Welcome Back" : "Join the Community"}
					</h1>

					{type != "signIn" ? (
						<InputBox
							name="username"
							type="text"
							placeholder="Username"
							icon="fi-rr-user"
						/>
					) : (
						""
					)}
					<InputBox
						name="email"
						type="email"
						placeholder="Email"
						icon="fi-rr-at"
					/>
					<InputBox
						name="password"
						type="password"
						placeholder="Password"
						icon="fi-rr-lock"
					/>

					<button
						className="whitespace-nowrap bg-black text-white rounded-md py-3 px-6 text-xl capitalize hover:bg-opacity-80 center mt-14"
						type="submit"
						onClick={handleSubmit}
					>
						{type === "signIn" ? "Sign In" : "Sign Up"}
					</button>

					<div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>

					<button
						className="btn-dark flex items-center justify-center w-[90%] center gap-4"
						onClick={handleGoogleAuth}
					>
						<img src={googleIcon} className="w-5" />
						continue with google
					</button>

					{type == "signIn" ? (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don't have an account yet?
							<Link to="/signUp" className="underline ml-1">
								Join Us
							</Link>
						</p>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Already have an account?
							<Link to="/signIn" className="underline ml-1">
								Sign in here.
							</Link>
						</p>
					)}
				</form>
			</section>
		</Animation>
	)
}

export default UserAuthForm
