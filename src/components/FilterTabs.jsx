const TABS = window.cm_nb_ra_in_bg_config?.tabs || [];

const FilterTabs = ({ activeTag, onTagChange }) => {
  return (
    <nav className="cm_nb_rp_bg_filter_tabs" aria-label="Filter blog posts">
      <ul className="cm_nb_rp_bg_tabs_list">
        {TABS.map((tab) => (
          <li key={tab.tag} className="cm_nb_rp_bg_tab_item">
            <button
              id={`cm_nb_rp_bg_tab_${tab.tag.replace(/\s+/g, '_').toLowerCase()}`}
              className={`cm_nb_rp_bg_tab_btn ${
                activeTag === tab.tag ? 'cm_nb_rp_bg_tab_active' : ''
              }`}
              onClick={() => onTagChange(tab.tag)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FilterTabs;
