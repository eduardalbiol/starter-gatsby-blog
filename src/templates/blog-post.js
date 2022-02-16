import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'

import Seo from '../components/seo'
import Layout from '../components/layout'
import Hero from '../components/hero'
import Tags from '../components/tags'
import * as styles from './blog-post.module.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const paragraph1 = get(this.props, 'data.contentfulBlogPostParagraph1TextNode')
    const paragraph2 = get(this.props, 'data.contentfulBlogPostParagraph2TextNode')
    const previous = get(this.props, 'data.previous')
    const next = get(this.props, 'data.next')

    return (
      <Layout location={this.props.location}>
        <Seo
          title={post.title}
        // textContent={post.textContent.childMarkdownRemark.excerpt}
        // image={`http:${post.image.resize.src}`}
        />
        <Hero
          image={post.image?.gatsbyImageData}
          title={post.title}
        // content={post.textContent?.childMarkdownRemark?.excerpt}
        />
        <div className={styles.container}>
          <span className={styles.meta}>
            {/* {post.author?.name} &middot;{' '} */}
            <time dateTime={post.rawDate}>{post.publishDate}</time> –{' '}
            {post.body?.childMarkdownRemark?.timeToRead} minute read
          </span>

          <div style={{ marginBottom: "30px", marginTop: "30px" }} >{paragraph1.internal?.content}</div>
          <div>{paragraph2.internal?.content}</div>


          <div className={styles.article}>
            <div
              className={styles.body}
              dangerouslySetInnerHTML={{
                __html: post.body?.childMarkdownRemark?.html,
              }}
            />
            <Tags tags={post.tags} />
            {(previous || next) && (
              <nav>
                <ul className={styles.articleNavigation}>
                  {previous && (
                    <li>
                      <Link to={`/blog/${previous.slug}`} rel="prev">
                        ← {previous.title}
                      </Link>
                    </li>
                  )}
                  {next && (
                    <li>
                      <Link to={`/blog/${next.slug}`} rel="next">
                        {next.title} →
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String!
    $previousPostSlug: String
    $nextPostSlug: String
  ) {
    contentfulBlogPost(slug: { eq: $slug }) {
      slug
      title
      publishDate(formatString: "MMMM Do, YYYY")
      rawDate: publishDate
      image {
        gatsbyImageData
      }
    }

    contentfulBlogPostParagraph1TextNode {
      internal {
        content
      }
    }

    contentfulBlogPostParagraph2TextNode {
      internal {
        content
      }
    }

    previous: contentfulBlogPost(slug: { eq: $previousPostSlug }) {
      slug
      title
    }
    next: contentfulBlogPost(slug: { eq: $nextPostSlug }) {
      slug
      title
    }
  }
`
