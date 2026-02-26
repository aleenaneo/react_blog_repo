const storefrontToken = window.cm_nb_ra_in_bg_config?.token;

/**
 * Build the GraphQL query string with the given tag filter and pagination.
 * @param {string} tagFilter - The tag to filter blog posts by.
 * @param {number} first - Number of posts to fetch.
 * @param {string} after - Cursor for the next set of results.
 * @returns {string} The GraphQL query string.
 */
const buildQuery = (tagFilter, first, after) => `
  query MyQuery {
    site {
      content {
        blog {
          posts(filters: {tags: "${tagFilter}"}, first: ${first}${after ? `, after: "${after}"` : ''}) {
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
              cursor
            }
            pageInfo {
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
            }
            collectionInfo {
              totalItems
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch blog posts from the GraphQL API with pagination.
 * @param {string} tagFilter - The tag to filter blog posts by.
 * @param {number} first - Number of posts to fetch.
 * @param {string} after - Cursor for pagination.
 * @returns {Promise<Object>} Object containing nodes and pageInfo.
 */
export const fetchBlogPosts = async (tagFilter, first = 10, after = null) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + storefrontToken,
      },
      body: JSON.stringify({
        query: buildQuery(tagFilter, first, after),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const postsData = data?.data?.site?.content?.blog?.posts;
    const edges = postsData?.edges || [];
    const pageInfo = postsData?.pageInfo || {};
    const totalItems = postsData?.collectionInfo?.totalItems || 0;

    return {
      posts: edges.map((edge) => edge.node),
      pageInfo,
      totalItems
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], pageInfo: {}, totalItems: 0 };
  }
};
