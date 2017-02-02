import Author from './parts/author';
import BlogPostImage from './parts/blog-post-image';
import BlogPostSection from './parts/blog-post-section';
import Comments from './parts/comments';
import ImageCaption from './parts/image-caption';
import React from 'react';
import Rubric from './parts/rubric';
import ShareBar, { getIconsPropTypes } from './parts/blog-post-sharebar';
import Text from './parts/text';
import { siblingList } from './parts/blog-post-siblings-list';

import classnames from 'classnames';
import urlJoin from 'url-join';

function twoDigits(int) {
  return int > 9 ? '' + int : '0' + int; // eslint-disable-line
}

export function generateBlogPostFlyTitle(
  showSiblingArticlesList,
  siblingListTitle,
  flyTitle
) {
  let blogFlyTitle = flyTitle;
  if (showSiblingArticlesList && siblingListTitle !== flyTitle) {
    blogFlyTitle = `${ siblingListTitle }: ${ flyTitle }`;
  }
  return blogFlyTitle;
}

export default class BlogPost extends React.Component {
  static get propTypes() {
    return {
      className: React.PropTypes.string,
      image: React.PropTypes.shape({
        src: React.PropTypes.string,
        caption: React.PropTypes.string,
        alt: React.PropTypes.string,
      }),
      author: React.PropTypes.string,
      byline: React.PropTypes.string,
      section: React.PropTypes.node,
      sectionUrl: React.PropTypes.string,
      flyTitle: React.PropTypes.string,
      title: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      publicationDate: React.PropTypes.string.isRequired,
      TitleComponent: React.PropTypes.func.isRequired,
      rubric: React.PropTypes.string,
      dateTime: React.PropTypes.instanceOf(Date),
      dateString: React.PropTypes.string,
      timestampISO: React.PropTypes.string,
      dateFormat: React.PropTypes.func,
      text: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.node,
      ]).isRequired,
      afterText: React.PropTypes.node,
      itemType: React.PropTypes.string,
      itemProp: React.PropTypes.string,
      commentCount: React.PropTypes.number.isRequired,
      commentStatus: React.PropTypes.oneOf([
        'disabled',
        'readonly',
        'readwrite',
        'fbcommentplugin',
      ]).isRequired,
      firstToCommentLabel: React.PropTypes.string.isRequired,
      viewCommentsLabel: React.PropTypes.string.isRequired,
      commentsUri: React.PropTypes.string.isRequired,
      blogImage: React.PropTypes.object,
      sectionName: React.PropTypes.string,
      issueSiblingsList: React.PropTypes.arrayOf(React.PropTypes.object),
      showSiblingArticlesList: React.PropTypes.bool,
      sideText: React.PropTypes.string,
      nextArticleLink: React.PropTypes.node,
      articleFootNote: React.PropTypes.node,
      articleListPosition: React.PropTypes.number,
      classNameModifier: React.PropTypes.string,
      siblingListSideTitle: React.PropTypes.string,
      shareBarDesktopIcons: getIconsPropTypes(),
      shareBarMobileIcons: getIconsPropTypes(),
      reuseButtonMaker: React.PropTypes.func,
      printEdition: React.PropTypes.bool,
    };
  }
  static get defaultProps() {
    return {
      itemType: 'http://schema.org/BlogPosting',
      itemProp: 'blogPost',
      firstToCommentLabel: 'Be the first to comment',
      viewCommentsLabel: 'View comments',
      reuseButtonMaker: () => null,
      dateFormat: (date) => {
        const tenMinutes = 10;
        // Sep 19th 2015, 9:49
        function addPostFix(day) {
          const daystr = day.toString();
          const lastChar = daystr.charAt(daystr.length - 1);
          let postFix = '';
          switch (lastChar) {
            case '1':
              postFix = 'st';
              break;
            case '2':
              postFix = 'nd';
              break;
            case '3':
              postFix = 'rd';
              break;
            default:
              postFix = 'th';
              break;
          }
          return `${ day }${ postFix }`;
        }
        const shortMonthList = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        let minutes = date.getMinutes() < tenMinutes ? '0' : '';
        minutes += date.getMinutes();
        return [ `${ shortMonthList[date.getMonth()] }`,
          `${ addPostFix(date.getDate()) }`,
          `${ date.getFullYear() },`,
          `${ date.getHours() }:${ minutes }` ].join(' ');
      },
    };
  }

  addDateTime(sectionDateAuthor, props) {
    const { dateTime, dateFormat, dateString, timestampISO } = props;
    let result = sectionDateAuthor.slice();
    if (dateTime) {
      result = result.concat((
        <time
          className="blog-post__datetime"
          itemProp="dateCreated"
          dateTime={this.props.dateTime}
          key="blog-post__datetime"
        >{dateFormat(dateTime)}</time>));
    }
    if (dateString && timestampISO) {
      result = result.concat((
        <time
          className="blog-post__datetime"
          itemProp="dateCreated"
          dateTime={timestampISO}
          key="blog-post__datetimeISO"
        >{dateString}</time>));
    }
    return result;
  }

  addImage(content, image = {}) {
    if (this.props.blogImage) {
      return [
        ...content,
        ...this.props.blogImage,
      ];
    } else if (image) {
      const { src, caption, alt } = image;
      if (src) {
        const imageCaption = caption ? <ImageCaption caption={caption} key="blog-post__image-caption" /> : null;
        return content.concat(
          <BlogPostImage
            key="blogimg"
            caption={imageCaption}
            src={src}
            alt={alt}
          />
        );
      }
    }
    return content;
  }

  addRubric(content, rubric) {
    if (rubric) {
      return content.concat(<Rubric rubric={rubric} key="blog-post__rubric" />);
    }
    return content;
  }

  addBlogPostSection(sectionDateAuthor, section, sectionUrl) {
    if (section) {
      if (sectionUrl && !/^(\w+:)?\/\//.test(sectionUrl)) {
        sectionUrl = urlJoin('/', sectionUrl);
      }
      const blogPostSection = sectionUrl ? (
        <a href={sectionUrl} className="blog-post__section-link">
          {section}
        </a>
      ) : section;
      return sectionDateAuthor.concat(
        <BlogPostSection key="blog-post__section" section={blogPostSection} />
      );
    }
    return sectionDateAuthor;
  }

  addByLine(sectionDateAuthor, byline) {
    if (byline) {
      return sectionDateAuthor.concat(
        <p className="blog-post__byline-container" key="blog-post__byline-container">
          {"by "}
          <span
            className="blog-post__byline"
            itemProp="author"
          >{byline}</span>
        </p>
      );
    }
    return sectionDateAuthor;
  }

  filterBlogPostTextElements(content) {
    const innerContentElements = content.filter((contentElement) => {
      const innerContent = contentElement.key === 'inner-content';
      return innerContent;
    })[0].props.children;
    const blogPostTextElements = innerContentElements.filter((contentElement) => {
      const blogPostText = contentElement.key === 'blog-post__text';
      return blogPostText;
    })[0].props.text;
    return blogPostTextElements;
  }

  moveBottomMobileAd(content) {
    const blogPostText = this.filterBlogPostTextElements(content);
    const numberOfParagraphs = blogPostText.length;
    const mobileAd = blogPostText[numberOfParagraphs - 1];
    if (mobileAd) {
      blogPostText.pop();
      content.push(mobileAd);
    }
  }


  addSiblingsList(siblingListProps) {
    const {
      showSiblingArticlesList,
      flyTitle,
      siblingsListTitle,
      elementClassName,
      content,
      issueSiblingsList,
      articleListPosition,
      nextArticleLink,
      printEdition,
    } = siblingListProps;
    const siblingArticles = showSiblingArticlesList && issueSiblingsList ?
    issueSiblingsList : null;
    const { sideText, siblingListSideTitle, articleFootNote } = this.props;
    const siblingListData = {
      siblingArticles,
      flyTitle,
      elementClassName,
      siblingsListTitle,
      sideText,
      siblingListSideTitle,
    };
    const siblingArticlesList = showSiblingArticlesList ? siblingList(siblingListData) : null;
    let blogPostTextElements = null;
    if (showSiblingArticlesList || articleFootNote) {
      blogPostTextElements = this.filterBlogPostTextElements(content);
    }
    if (showSiblingArticlesList && (blogPostTextElements || (content && nextArticleLink))) {
      blogPostTextElements.splice(articleListPosition, 0, siblingArticlesList);
      content.splice(content.length - 1, 0, nextArticleLink);
    }
    if (articleFootNote && printEdition) {
      blogPostTextElements.push(articleFootNote);
    }
  }

  generateWrappedInnerContent(asideableContent) {
    let wrappedInnerContent = [];
    wrappedInnerContent = this.addImage(wrappedInnerContent, this.props.image);
    if (asideableContent.length) {
      wrappedInnerContent.push((
        <div className="blog-post__asideable-wrapper" key="asideable-content"
          ref="asideable"
        >
          <div className="blog-post__asideable-content blog-post__asideable-content--meta">
            {asideableContent}
          </div>
        </div>
      ));
    }
    if (this.props.author) {
      wrappedInnerContent.push(<Author key="blog-post__author" author={this.props.author} />);
    }
    wrappedInnerContent.push(<Text text={this.props.text} key="blog-post__text" />);
    wrappedInnerContent.push(<div key="blog-post__after-text">{this.props.afterText}</div>);
    return wrappedInnerContent;
  }

  render() {
    const {
      id,
      title,
      flyTitle,
      showSiblingArticlesList,
      siblingListSideTitle,
      issueSiblingsList,
      articleListPosition,
      nextArticleLink,
      printEdition,
    } = this.props;
    const siblingsListTitle = this.props.sectionName;
    const elementClassName = showSiblingArticlesList && this.props.classNameModifier ?
      `blog-post__siblings-list--${ this.props.classNameModifier }` : '';
    let content = [];
    // aside and text content are wrapped together into a component.
    // that makes it easier to move the aside around relatively to its containter
    const asideableContent = [];
    let sectionDateAuthor = [];
    content = this.addRubric(content, this.props.rubric);
    sectionDateAuthor = this.addBlogPostSection(sectionDateAuthor, this.props.section, this.props.sectionUrl);
    sectionDateAuthor = this.addDateTime(sectionDateAuthor, this.props);
    sectionDateAuthor = this.addByLine(sectionDateAuthor, this.props.byline);
    if (sectionDateAuthor.length) {
      asideableContent.push(
        <div
          className="blog-post__section-date-author"
          key="blog-post__section-date-author"
        >
          {sectionDateAuthor}
        </div>
      );
    }

    // Share bar publicationDate formatted
    let shareBarPublicateDate = new Date(this.props.publicationDate * 1000) // eslint-disable-line
    shareBarPublicateDate = `${ String(shareBarPublicateDate.getFullYear()) }
    ${ String(twoDigits(shareBarPublicateDate.getMonth() + 1)) }
    ${ String(twoDigits(shareBarPublicateDate.getDate())) }`.replace(/\s/g, '');
    const sharebarType = this.props.type === 'post' ? 'BL' : 'A';
    const shareBarDefault =
      (<ShareBar
        key="sharebar"
        type={sharebarType}
        title={title}
        flyTitle={flyTitle}
        publicationDate={shareBarPublicateDate}
        contentID={id}
        desktopIcons={this.props.shareBarDesktopIcons}
        mobileIcons={this.props.shareBarMobileIcons}
       />);
    asideableContent.push(
      shareBarDefault
    );
    const wrappedInnerContent = this.generateWrappedInnerContent(asideableContent);
    content.push(<div className="blog-post__inner" key="inner-content">{wrappedInnerContent}</div>);
    const { commentCount, commentStatus } = this.props;
    let commentSection = null;
    if (commentStatus !== 'disabled' && !(commentStatus === 'readonly' && commentCount === 0)) {
      commentSection = (
        <Comments
          key="blog-post__comments"
          firstToCommentLabel={this.props.firstToCommentLabel}
          commentCount={commentCount}
          viewCommentsLabel={this.props.viewCommentsLabel}
          commentsUri={this.props.commentsUri}
        />
      );
    }
    content.push(
      <div className="blog-post__bottom-panel" key="blog-post__bottom-panel">
        <div className="blog-post__bottom-panel-top">
          {shareBarDefault}
          {commentSection}
        </div>
        <div className="blog-post__bottom-panel-bottom">
          {this.props.reuseButtonMaker({
            type: sharebarType,
            title,
            publicationDate: shareBarPublicateDate,
            id,
          })}
        </div>
      </div>
    );
    this.moveBottomMobileAd(content);

    const TitleComponent = this.props.TitleComponent;
    const articleHeader = showSiblingArticlesList ? (
      <span className={`blog-post__siblings-list-header ${ elementClassName }`}>
        {siblingsListTitle}
      </span>
    ) : null;
    const siblingListProps = {
      showSiblingArticlesList,
      flyTitle,
      siblingsListTitle,
      elementClassName,
      content,
      issueSiblingsList,
      articleListPosition,
      nextArticleLink,
      printEdition,
    };
    this.addSiblingsList(siblingListProps);
    return (
      <article
        itemScope
        className={classnames('blog-post', this.props.className)}
        itemProp={this.props.itemProp}
        itemType={this.props.itemType}
        role="article"
        ref="article"
      >
        {articleHeader}
        <TitleComponent
          title={this.props.title}
          flyTitle={generateBlogPostFlyTitle(showSiblingArticlesList, siblingListSideTitle, flyTitle)}
          Heading={"h1"}
          titleClassName={showSiblingArticlesList ?
            `flytitle-and-title__siblings-list-title ${ elementClassName }` : ''}
          flyTitleClassName={showSiblingArticlesList ?
            `flytitle-and-title__siblings-list-flytitle ${ elementClassName }` : ''}
        />
        {content}
      </article>
    );
  }
}
