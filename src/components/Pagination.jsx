const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="cm_nb_rp_bg_pagination_wrapper">
      {/* Right side mini arrows */}
      <div className="cm_nb_rp_bg_pagination_right">
        {currentPage > 1 && (
          <button
            className="cm_nb_rp_bg_mini_arrow"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {currentPage < totalPages && (
          <button
            className="cm_nb_rp_bg_mini_arrow"
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
