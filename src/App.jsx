import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import BlogGrid from './components/BlogGrid';
import Pagination from './components/Pagination';
import { fetchBlogPosts } from './services/blogService';
import './App.css';

const POSTS_PER_PAGE = window.cm_nb_ra_in_bg_config?.postsPerPage || 10;
const POSTS_DISPLAY_COUNT = window.cm_nb_ra_in_bg_config?.postsDisplayCount || 20;
const configTabs = window.cm_nb_ra_in_bg_config?.tabs || [];
const DEFAULT_TAG = configTabs.length > 0 ? configTabs[0].tag : '';
function App() {
  const [allPosts, setAllPosts] = useState([]);
  const [activeTag, setActiveTag] = useState(DEFAULT_TAG);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const debounceRef = useRef(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadPosts = async (tag, cursor = null, isAppending = false) => {
    setIsLoading(true);
    const result = await fetchBlogPosts(tag, POSTS_DISPLAY_COUNT, cursor);
    
    if (isAppending) {
      setAllPosts(prev => [...prev, ...result.posts]);
    } else {
      setAllPosts(result.posts);
    }
    
    setTotalItems(result.totalItems);
    setEndCursor(result.pageInfo.endCursor);
    setHasNextPage(result.pageInfo.hasNextPage);
    setIsLoading(false);
  };

  // Fetch posts when tag changes
  useEffect(() => {
    setCurrentPage(1);
    setAllPosts([]);
    loadPosts(activeTag, null, false);
  }, [activeTag]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  // Filter posts by search query (client-side)
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts;
    const q = searchQuery.toLowerCase();
    return allPosts.filter((post) =>
      post.name.toLowerCase().includes(q)
    );
  }, [allPosts, searchQuery]);

  // Sliding logic
  const SHIFT_COUNT = POSTS_PER_PAGE - 2;
  
  const currentVisiblePosts = useMemo(() => {
    const start = (currentPage - 1) * SHIFT_COUNT;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage, SHIFT_COUNT]);

  // Calculate total slides based on totalItems from server
  const totalSlides = useMemo(() => {
    if (totalItems <= POSTS_PER_PAGE) return 1;
    return Math.ceil((totalItems - POSTS_PER_PAGE) / SHIFT_COUNT) + 1;
  }, [totalItems, SHIFT_COUNT]);

  // Handlers
  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag);
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handleSearchClick = useCallback(() => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalSlides) {
        // If we are moving forward and the required data is not loaded yet
        const requiredCount = (page - 1) * SHIFT_COUNT + POSTS_PER_PAGE;
        if (page > currentPage && filteredPosts.length < requiredCount && hasNextPage) {
          loadPosts(activeTag, endCursor, true);
        }
        setCurrentPage(page);
      }
    },
    [totalSlides, currentPage, filteredPosts.length, hasNextPage, endCursor, activeTag, SHIFT_COUNT]
  );

  const handleRestart = useCallback(() => {
    setActiveTag(DEFAULT_TAG);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return (
    <div className="cm_nb_rp_bg_app">
      <div className="cm_nb_rp_bg_container">
        <div className="cm_nb_rp_bg_centered_wrapper">
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
        </div>

        <section className="cm_nb_rp_bg_content_full">
          <BlogGrid 
            key={currentPage} 
            posts={currentVisiblePosts} 
            isLoading={isLoading} 
            isLastPage={currentPage === totalSlides}
          />
        </section>

        <div className="cm_nb_rp_bg_centered_wrapper">
          <footer className="cm_nb_rp_bg_footer">
            <Pagination
              currentPage={currentPage}
              totalPages={totalSlides}
              onPageChange={handlePageChange}
            />
          </footer>
        </div>
      </div>
    </div>
  );
}


export default App;
