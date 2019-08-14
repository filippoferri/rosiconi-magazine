import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import SimilarArticles from '../components/SimilarArticles'
import Content, { HTMLContent } from '../components/Content'

export const BlogPostTemplate = ({
  content,
  contentComponent,
  tags,
  title,
  category,
  currentSlug,
  helmet,
  next,
  prev
}) => {
  const PostContent = contentComponent || Content

  return (
    <section className="section">
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-6 is-offset-3">
            <h1 className="title is-size-2 is-bold-light has-text-centered">
              {title}
            </h1>
            <PostContent content={content} />
            <div>
              {next &&
                <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
              }
            </div>
            <div>
              {prev &&
              <Link to={prev.fields.slug}>{prev.frontmatter.title}</Link>
              }
            </div>
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <SimilarArticles category={category} tags={tags} currentArticleSlug={currentSlug} />
          </div>
        </div>
      </div>
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const BlogPost = ({ data, pageContext }) => {
  const { markdownRemark: post } = data
  const {next, prev} = pageContext

  return (
    <Layout>
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        category={post.frontmatter.category}
        currentSlug={post.fields.slug}
        next={next}
        prev={prev}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        slug
      }
      frontmatter {
        date(formatString: "DD MMMM, YYYY", locale: "it")
        title
        description
        tags
        category
      }
    }
  }
`
