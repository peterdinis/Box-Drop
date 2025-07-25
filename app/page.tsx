import FeaturesWrapper from "@/components/home/FeaturesWrapper";
import HeroWrapper from "@/components/home/HeroWrapper";
import StatsWrapper from "@/components/home/StatsWrapper";
import { NextPage } from "next";

const Homepage: NextPage = () => {
  return (
    <>
      <HeroWrapper />
      <StatsWrapper />
      <FeaturesWrapper />
    </>
  );
}   

export default Homepage;