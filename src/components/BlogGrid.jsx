import BlogCard from './BlogCard';

const BlogGrid = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="cm_nb_rp_bg_grid_loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="cm_nb_rp_bg_skeleton_card">
            <div className="cm_nb_rp_bg_skeleton_image" />
            <div className="cm_nb_rp_bg_skeleton_text" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="cm_nb_rp_bg_empty_state">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
        <p className="cm_nb_rp_bg_empty_text">Not found</p>
        {/* <p className="cm_nb_rp_bg_empty_subtext">
          Try adjusting your search or filter criteria
        </p> */}
      </div>
    );
  }

  return (
    <div className="cm_nb_rp_bg_grid">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;
