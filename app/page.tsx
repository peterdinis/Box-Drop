import type { NextPage } from "next";
import CTASection from "@/components/home/CTASection";
import FeaturesWrapper from "@/components/home/FeaturesWrapper";
import HeroWrapper from "@/components/home/HeroWrapper";
import StatsWrapper from "@/components/home/StatsWrapper";
import Footer from "@/components/shared/Footer";

const Homepage: NextPage = () => {
	return (
		<>
			<HeroWrapper />
			<StatsWrapper />
			<FeaturesWrapper />
			<CTASection />
			<Footer />
		</>
	);
};

export default Homepage;
