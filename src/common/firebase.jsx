// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
	apiKey: "AIzaSyB13XM-gN4ZtIqOiTD6sSAJig5deXQhnJo",
	authDomain: "monogatari-react.firebaseapp.com",
	projectId: "monogatari-react",
	storageBucket: "monogatari-react.appspot.com",
	messagingSenderId: "939459989479",
	appId: "1:939459989479:web:535227f95c41b8aa1bf742",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

//Google Auth

const googleProvider = new GoogleAuthProvider()

const auth = getAuth(app)

export const AuthWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, googleProvider)
		const user = result.user
		const idToken = await user.getIdToken()
		return { idToken }
	} catch (error) {
		console.error("Error during Google authentication:", error)
		throw error
	}
}

// const userCred = await signInWithPopup(auth, new GoogleAuthProvider());
