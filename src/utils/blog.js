const _ = require('lodash')

export function getPostsFromQuery (posts) {
  if (posts) {
    return posts.edges
        .map(edge => edge.node)
        .map(node => Object.assign({}, node.frontmatter, node.fields))
  }

  return []
}


export function getCategoriesFromQuery(categories) {
  if (categories) {
    return _.uniq(
        categories.edges
            .map(edge => edge.node)
            .map(node => Object.assign({}, node.frontmatter))
            .map(c => c.category)
            .sort()
    )
  }
  return []
}
