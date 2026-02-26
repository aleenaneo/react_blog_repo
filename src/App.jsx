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
  const debounceRef = useRef(null);

  // Fetch posts when tag changes
  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      setIsLoading(true);
      const data = await fetchBlogPosts(activeTag);
      if (!cancelled) {
        setPosts(data);
        setCurrentPage(1);
        setIsLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [activeTag]);

  // Debounced search - 300ms
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
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter((post) =>
      post.name.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // Pagination calculations
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE)),
    [filteredPosts.length]
  );

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Handlers
  const handleTagChange = useCallback((tag) => {
    setActiveTag(tag);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleSearchClick = useCallback(() => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
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
          <BlogGrid posts={paginatedPosts} isLoading={isLoading} />
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
