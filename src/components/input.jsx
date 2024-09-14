import { useState } from "react"

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
	const [isPassword, setIsPassword] = useState(false)
	return (
		<div className="relative w-[100%] mb-4">
			<input
				name={name}
				type={type == "password" ? (isPassword ? "text" : "password") : type}
				placeholder={placeholder}
				id={id}
				defaultValue={value}
				className="input-box"
			></input>
			<i className={"fi " + icon + " input-icon"}></i>

			{type == "password" ? (
				<i
					className={
						"fi fi-rr-eye" +
						(!setIsPassword ? "-crossed" : "") +
						" input-icon left-[auto]  right-4 cursor-pointer"
					}
					onClick={() => setIsPassword((currentVal) => !currentVal)}
				></i>
			) : (
				""
			)}
		</div>
	)
}

export default InputBox
