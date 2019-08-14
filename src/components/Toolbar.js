import React from 'react'
import {kebabCase} from 'lodash'
import {Link, graphql, StaticQuery} from 'gatsby'
import {getCategoriesFromQuery} from '../utils/blog'

class Toolbar extends React.Component {

  render() {

    const {data} = this.props
    const edges = data.allMarkdownRemark

    const categories = getCategoriesFromQuery(edges)

    return (
        <div className="toolbar">
          <div className="cat-navigation">
            <ul>
              {categories.map((category, i) => (
                  <li>
                    <Link className="cat-navigation-item" to={`/${kebabCase(category)}/`} key={i}>{category}</Link>
                  </li>
              ))}
            </ul>
          </div>
        </div>)
  }
}

export default () => (
    <StaticQuery
        query={graphql`
      query ToolBarQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" }, published: { eq: true } } }
        ) {
          edges {
            node {
              id
              frontmatter {
                category
              }
            }
          }
        }
      }
    `}
        render={(data) => <Toolbar data={data}/>}
    />
)

