import { useState } from 'react';

const BlogCard = ({ post }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = post.thumbnailImage?.urlOriginal;

  return (
    <a href={post.path} className="cm_nb_rp_bg_card_link" id={`cm_nb_rp_bg_card_${post.entityId}`}>
      <article className="cm_nb_rp_bg_card">
        <div className="cm_nb_rp_bg_card_image_wrapper">
          {imageUrl && !imgError ? (
            <img
              className="cm_nb_rp_bg_card_image"
              src={imageUrl}
              alt={post.name}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="cm_nb_rp_bg_card_placeholder">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
        <div className="cm_nb_rp_bg_card_info">
          <h3 className="cm_nb_rp_bg_card_title">{post.name.split(' ')[0]}</h3>
        </div>
      </article>
    </a>
  );
};

export default BlogCard;
