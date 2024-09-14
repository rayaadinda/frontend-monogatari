import { useContext, useState, useEffect } from "react"
import logo from "/assets/favicon.png"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import UserNavigation from "./userNavigation"

const Navbar = () => {
	const [searchBoxVisible, setSearchBoxVisible] = useState(false)

	const [userNavPanel, setUserNavPanel] = useState(false)

	let navigate = useNavigate()

	const {
		userAuth,
		userAuth: { access_token, profile_img },
	} = useContext(UserContext)

	useEffect(() => {}, [userAuth])

	const handleUserNavPanel = () => {
		setUserNavPanel((currentVal) => !currentVal)
	}

	const handleSearch = (e) => {
		let query = e.target.value
		console.log(e)

		if (e.keyCode == 13 && query.length) {
			navigate(`/search/${query}`)
		}
	}

	const handleBlur = () => {
		setTimeout(() => {
			setUserNavPanel(false)
		}, 200)
	}

	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-14 p-2">
					<img src={logo} alt="logo" className="w-full " />
				</Link>
				<div
					className={
						"absolute bg-white w-full left-0 top-full mt-0.! border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
						(searchBoxVisible ? "show" : "hide")
					}
				>
					<input
						type="text"
						placeholder="Search"
						className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
						onKeyDown={handleSearch}
					/>
					<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl text-dark-grey"></i>
				</div>

				<div className="flex items-center gap-3 md:gap-6 ml-auto">
					<button
						className="md:hidden  w-12 h-12 rounded-full flex items-center justify-center"
						onClick={() => setSearchBoxVisible((currentVal) => !currentVal)}
					>
						<i class="fi fi-rr-search block mt-1 -mr-6 text-2xl"></i>
					</button>
					<Link to="/editor" className="hidden md:flex gap-2 link">
						<i className="fi fi-rr-pen-square"></i>
						<p>Write</p>
					</Link>

					{access_token ? (
						<>
							<Link to="/dashboard/notifications">
								<button className="w-12 h-12 relative hover:bg-black/10">
									<i className="fi fi-rr-bell text-2xl block mt-1 "></i>
								</button>
							</Link>

							<div className="relative" onClick={handleUserNavPanel}>
								<button className="w-12 h-12 mt-1">
									<img
										src={profile_img}
										alt="profile"
										className="w-full h-full object-cover rounded-full"
									/>
								</button>
								{userNavPanel ? <UserNavigation /> : ""}
							</div>
						</>
					) : (
						<>
							<Link className="btn-dark py-2" to="/signIn">
								Sign In
							</Link>
							<Link className="btn-light py-2 hidden md:block" to="/signUp">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</nav>

			<Outlet />
		</>
	)
}

export default Navbar
