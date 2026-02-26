import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import BlogGrid from './components/BlogGrid';
import Pagination from './components/Pagination';
import { fetchBlogPosts } from './services/blogService';
import './App.css';

const POSTS_PER_PAGE = window.cm_nb_ra_in_bg_config?.postsPerPage || 10;
const configTabs = window.cm_nb_ra_in_bg_config?.tabs || [];
const DEFAULT_TAG = configTabs.length > 0 ? configTabs[0].tag : '';

function App() {
  const [posts, setPosts] = useState([]);
  const [activeTag, setActiveTag] = useState(DEFAULT_TAG);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [pageCursors, setPageCursors] = useState({ 1: null }); // Map page number to 'after' cursor
  const debounceRef = useRef(null);

  const loadPosts = async (tag, pageNum, afterCursor = null) => {
    setIsLoading(true);
    const result = await fetchBlogPosts(tag, POSTS_PER_PAGE, afterCursor);
    
    setPosts(result.posts);
    setPageInfo(result.pageInfo);
    setTotalItems(result.totalItems);
    setCurrentPage(pageNum);
    
    // If we have a next page, store its cursor for the next page number
    if (result.pageInfo.hasNextPage) {
      setPageCursors(prev => ({
        ...prev,
        [pageNum + 1]: result.pageInfo.endCursor
      }));
    }
    
    setIsLoading(false);
  };

  // Fetch posts when tag changes
  useEffect(() => {
    setPageCursors({ 1: null });
    loadPosts(activeTag, 1, null);
  }, [activeTag]);

  // Debounced search - 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
      // Note: With server-side pagination, search should ideally be server-side.
      // For now, we keep the client-side filtering on the current page's posts.
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  // Filter posts by search query (client-side on current page results)
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter((post) =>
      post.name.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // Pagination calculations
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE)),
    [totalItems]
  );

  // Handlers
  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag);
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handleSearchClick = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        const cursor = pageCursors[page];
        loadPosts(activeTag, page, cursor);
      }
    },
    [totalPages, currentPage, activeTag, pageCursors]
  );

  const handleRestart = useCallback(() => {
    setActiveTag(DEFAULT_TAG);
    setSearchInput('');
    setSearchQuery('');
  }, []);

  return (
    <div className="cm_nb_rp_bg_app">
      <div className="cm_nb_rp_bg_container">
        <Header />

        <div className="cm_nb_rp_bg_controls">
          <FilterTabs activeTag={activeTag} onTagChange={handleTagChange} />
          <div className="cm_nb_rp_bg_search_wrapper">
            <div className="cm_nb_rp_bg_search_container">
              <svg
                className="cm_nb_rp_bg_search_icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                id="cm_nb_rp_bg_search_input"
                type="text"
                className="cm_nb_rp_bg_search_input"
                placeholder="Search for Support"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchClick();
                }}
              />
            </div>
            <button
              id="cm_nb_rp_bg_search_btn"
              className="cm_nb_rp_bg_search_btn"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </div>
        </div>

        <section className="cm_nb_rp_bg_content">
          <BlogGrid posts={filteredPosts} isLoading={isLoading} />
        </section>

        <footer className="cm_nb_rp_bg_footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </footer>
      </div>
    </div>
  );
}

export default App;
