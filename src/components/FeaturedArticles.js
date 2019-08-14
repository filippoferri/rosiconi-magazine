import React from 'react'
import PropTypes from 'prop-types'
import {Link, graphql, StaticQuery} from 'gatsby'

import Slider from "react-slick"

import PreviewCompatibleImage from './PreviewCompatibleImage'

class FeaturedArticles extends React.Component {

  render() {
    const {data} = this.props
    const {edges: posts} = data.allMarkdownRemark

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
        <div style={{padding: '1rem'}}>
          <Slider {...settings}>
            {posts &&
            posts.map(({node: post, index}) => (
                <div>
                  <article className="columns  is-vcentered" key={index}>
                    <div className="column is-6">
                      <Link
                          className="hfeatured-thumbnail"
                          to={post.fields.slug}
                      >
                        {post.frontmatter.featuredimage ? (
                            <PreviewCompatibleImage
                                imageInfo={{
                                  image: post.frontmatter.featuredimage,
                                  alt: `featured image thumbnail for post ${
                                      post.title
                                      }`,
                                }}
                            />
                        ) : null}
                      </Link>

                    </div>
                    <div className="column is-6 has-text-centered">
                      <div style={{padding: '1rem'}}>
                        <Link
                            className="has-text-primary"
                            to={post.fields.slug}
                        >
                          <h2 className="title is-size-2">{post.frontmatter.title}</h2>
                        </Link>
                        <p>{post.frontmatter.description}</p>
                      </div>
                    </div>
                  </article>
                </div>
            ))}
          </Slider>
        </div>
    )
  }
}

FeaturedArticles.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
    <StaticQuery
        query={graphql`
      query FeaturedArticlesQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" }, featuredpost: {eq: true} } }
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
        render={(data, count) => <FeaturedArticles data={data} count={count}/>}
    />
)
