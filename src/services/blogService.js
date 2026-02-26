const storefrontToken = window.cm_nb_ra_in_bg_config?.token;

/**
 * Build the GraphQL query string with the given tag filter.
 * @param {string} tagFilter - The tag to filter blog posts by.
 * @returns {string} The GraphQL query string.
 */
const buildQuery = (tagFilter) => `
  query MyQuery {
    site {
      content {
        blog {
          posts(filters: {tags: "${tagFilter}"}) {
            edges {
              node {
                name
                id
                path
                tags
                thumbnailImage {
                  urlOriginal(lossy: false)
                }
                entityId
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch blog posts from the GraphQL API filtered by tag.
 * @param {string} tagFilter - The tag to filter blog posts by.
 * @returns {Promise<Array>} Array of blog post nodes.
 */
export const fetchBlogPosts = async (tagFilter) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storefrontToken,
      },
      body: JSON.stringify({
        query: buildQuery(tagFilter),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const edges = data?.data?.site?.content?.blog?.posts?.edges || [];
    return edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};
