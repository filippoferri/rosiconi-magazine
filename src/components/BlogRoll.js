import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import {Link, graphql, StaticQuery} from 'gatsby'

import Masonry from 'react-masonry-component';
import PreviewCompatibleImage from './PreviewCompatibleImage'

const masonryOptions = {
  transitionDuration: 0,
  itemSelector: ".masonry-block",
  columnWidth: ".grid-sizer",
  fitWidth: true,
  percentPosition: true
};

class BlogRoll extends React.Component {

  render() {
    const {data} = this.props
    const {edges: posts} = data.allMarkdownRemark

    return (
        <Masonry
            className={'masonry'}
            options={masonryOptions}
        >
          <div className="grid-sizer"></div>
          <div className="lines">
            <span></span>
            <span></span>
          </div>
          {posts &&
          posts.map(({node: post, index}) => (


              <div className="masonry-block" key={index}>
                <article
                    className={`masonry-item ${
                        post.frontmatter.featuredpost ? 'is-featured' : ''
                        }`}
                >
                  <header>
                    <Link
                        className="has-text-primary"
                        to={post.fields.slug}
                    >
                      {post.frontmatter.title}
                    </Link>
                    {post.frontmatter.featuredimage ? (
                        <div className="featured-thumbnail">
                          <PreviewCompatibleImage
                              imageInfo={{
                                image: post.frontmatter.featuredimage,
                                alt: `featured image thumbnail for post ${
                                    post.title
                                    }`,
                              }}
                          />
                        </div>
                    ) : null}

                  </header>
                  <p>{post.frontmatter.description}</p>
                  <footer>
                    <div className="meta">
                      <span className="">
                      {post.frontmatter.date}</span>&nbsp;/&nbsp;
                      {post.frontmatter.category ? (
                          <Link to={`/${kebabCase(post.frontmatter.category)}/`}>{post.frontmatter.category}</Link>
                      ) : null}
                    </div>
                  </footer>
                </article>
              </div>

          ))}
        </Masonry>
    )
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
    <StaticQuery
        query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { 
            templateKey: { eq: "blog-post" }, 
            featuredpost: { ne: true } ,
            published: { eq: true }
           } 
          }
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                description
                category
                tags
                templateKey
                date(formatString: "DD MMMM, YYYY", locale: "it")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
        render={(data, count) => <BlogRoll data={data} count={count}/>}
    />
)
