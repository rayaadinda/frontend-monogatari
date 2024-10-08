import { useRef, useState, useEffect } from "react"

export let activeTabLineRef
export let activeTabRef

const InPagenavigation = ({
	routes,
	defaultHidden = [],
	defaultActiveIndex = 0,
	children,
}) => {
	let [activeRouteIndex, setActiveRouteIndex] = useState(defaultActiveIndex)

	activeTabLineRef = useRef()
	activeTabRef = useRef()

	const changePageState = (btn, i) => {
		let { offsetWidth, offsetLeft } = btn

		activeTabLineRef.current.style.width = offsetWidth + "px"
		activeTabLineRef.current.style.left = offsetLeft + "px"

		setActiveRouteIndex(i)
	}

	useEffect(() => {
		changePageState(activeTabRef.current, defaultActiveIndex)
	}, [])

	return (
		<>
			<div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
				{routes.map((route, i) => {
					return (
						<button
							ref={i == activeRouteIndex ? activeTabRef : null}
							key={i}
							className={
								"p-4 px-5 capitalize " +
								(activeRouteIndex == i ? "text-black " : "text-dark-grey ") +
								(defaultHidden.includes(route) ? "md:hidden " : " ")
							}
							onClick={(e) => {
								changePageState(e.target, i)
							}}
						>
							{route}
						</button>
					)
				})}

				<hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
			</div>
			{Array.isArray(children) ? children[activeRouteIndex] : children}
		</>
	)
}

export default InPagenavigation
