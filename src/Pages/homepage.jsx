import Animation from "../common/pageAnimation"
import InPagenavigation from "../components/inPageNavigation"

const homePage = () => {
	return (
		<Animation>
			<section className=" h-cover flex justify-center gap-10">
				<div className="w-full">
					<InPagenavigation routes={["Home", "Trending"]}></InPagenavigation>
				</div>
			</section>
		</Animation>
	)
}

export default homePage
