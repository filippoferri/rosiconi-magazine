const _ = require('lodash')
const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')
const {fmImagesToRelative} = require('gatsby-remark-relative-images')

exports.createPages = ({actions, graphql}) => {
  const {createPage} = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              title
              tags
              templateKey
              category
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const pages = result.data.allMarkdownRemark.edges

    // Pages except posts
    pages
        .filter((edge) => edge.node.frontmatter.templateKey !== 'blog-post')
        .forEach((edge) => {

          const id = edge.node.id

          createPage({
            path: edge.node.fields.slug,
            tags: edge.node.frontmatter.tags,
            component: path.resolve(
                `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
            ),
            // additional data can be passed via context
            context: {
              id,
            },
          })
        })

    const posts = pages.filter((edge)  => edge.node.frontmatter.templateKey === 'blog-post')

    posts.forEach((edge, index) => {
      const id = edge.node.id
      const prev = index === 0 ? null : posts[index - 1].node
      const next = index === (posts.length - 1) ? null : posts[index + 1].node

      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
            `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
          prev,
          next
        },
      })
    })

    // Tag and Categories pages:
    let tags = []
    let categories = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }

      if (_.get(edge, `node.frontmatter.category`)) {
        categories.push(edge.node.frontmatter.category)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)
    categories = _.uniq(categories)

    // Make tag pages
    tags.forEach(tag => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })

    // Make category pages
    categories.forEach(category => {
      const categoryPath = `/${_.kebabCase(category)}/`

      createPage({
        path: categoryPath,
        component: path.resolve(`src/templates/categories.js`),
        context: {
          category,
        },
      })
    })

  })
}

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({node, getNode})
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
