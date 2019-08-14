import React from 'react'
//import PropTypes from 'prop-types'
import {getPostsFromQuery} from '../utils/blog'
import {Link, graphql, StaticQuery} from 'gatsby'
import {SimilarArticlesFactory} from './SimilarArticlesFactory'


const SimilarArticlesComponent = ({posts}) => (
    <section className="similar-articles">
      <h2>Similar Articles</h2>
      {console.log(posts)}
      {posts.map((post, i) => (
          <div key={i}><Link to={post.article.slug}>{post.article.title}</Link></div>
      ))}
    </section>
)

export default (props) => (
    <StaticQuery
        query={graphql`
      query SimilarArticles {    
        posts: allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              templateKey: { eq: "blog-post" }
              published: { eq: true }
            }
          }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                date
                description
                tags
                category
              }
            }
          }
        }
      }
    `}
        render={data => {
          const {category, tags, currentArticleSlug} = props;

          // (2.) Marshall the response into articles
          const articles = getPostsFromQuery(data.posts);

          // (3.) Use a SimilarArticlesFactory to get my similar articles
          const similarArticles = new SimilarArticlesFactory(
              articles, currentArticleSlug
          )
              .setMaxArticles(2)
              .setCategory(category)
              .setTags(tags)
              .getArticles()

          // (4.) Render it
          return (
              <SimilarArticlesComponent
                  posts={similarArticles}
              />
          )
        }}
    />
)
