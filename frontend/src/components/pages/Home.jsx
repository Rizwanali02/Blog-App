import React, { useContext } from "react";
import { Context } from "../../main";
import HeroSection from "../miniComponents/HeroSection";
import TrendingBlogs from "../miniComponents/TrendingBlogs";
import LatestBlogs from "../miniComponents/LatesBlog";
import PopularAuthors from "../miniComponents/PopularAuthors";

const Home = () => {
  const { mode, blogs } = useContext(Context);
  const filterBlogs = blogs.slice(0, 6);

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <HeroSection />
      <TrendingBlogs />
      <LatestBlogs blogs={filterBlogs} heading={"Latest Blogs"}/>
      <PopularAuthors />
    </article>
  );
};

export default Home;
