import React from "react";
import { Link } from "react-router-dom";

const LatestBlogs = ({ heading, newClass, blogs }) => {
  return (
    <section className={`blogs ${newClass ? "dashboard-blogs" : ""}`}>
      <h3>{heading}</h3>
      <div className="blogs-container">
        {blogs && blogs.map((blog) => (
          <Link to={`/blog/${blog._id}`} className="blog-card" key={blog._id}>
            <img src={blog.mainImage?.url} alt="blog" />
            <span className="blog-category">{blog.category}</span>
            <h4>{blog.title}</h4>
            <div className="writer-section">
              <div className="author">
                <img src={blog.authorAvatar} alt="author_avatar" />
                <p>{blog.authorName}</p>
              </div>
            </div>
          </Link>
        ))}
        {!blogs && <p>No blogs available</p>}
      </div>
    </section>
  );
};

export default LatestBlogs;
