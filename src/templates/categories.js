import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

class CategoryRoute extends React.Component {
  render() {

    const posts = this.props.data.allMarkdownRemark.edges
    const postLinks = posts.map(post => (
        <li key={post.node.fields.slug}>
          <Link to={post.node.fields.slug}>
            <h2 className="is-size-2">{post.node.frontmatter.title}</h2>
          </Link>
        </li>
    ))
    const category = this.props.pageContext.category
    const title = this.props.data.site.siteMetadata.title

    return (
        <Layout>
          <section className="section">
            <Helmet title={`${category} | ${title}`} />
            <div className="container content">
              <div className="columns">
                <div
                    className="column is-10 is-offset-1"
                    style={{ marginBottom: '6rem' }}
                >
                  <h3 className="title is-size-4 is-bold-light">{category}</h3>
                  <ul className="taglist">{postLinks}</ul>
                </div>
              </div>
            </div>
          </section>
        </Layout>
    )
  }
}

export default CategoryRoute

export const categoryPageQuery = graphql`
  query CategoryPage($category: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { 
        frontmatter: { 
          category: { eq: $category }
          published: { eq: true }
        } 
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            description
            category
          }
        }
      }
    }
  }
`
