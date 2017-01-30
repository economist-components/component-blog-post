import React from 'react';

export default function Comments({ firstToCommentLabel, commentCount, viewCommentsLabel, commentsUri }) {
  let content = firstToCommentLabel;
  let pre = null;
  if (commentCount > 0) {
    content = '';
    pre = <span className="blog-post__comments-contentwrapper">{`${ viewCommentsLabel }`}</span>;
  }
  let contentNode = <span className="blog-post__comments-content">{content}</span>;
  if (content === '') {
    contentNode = null;
  }
  return (
    <a className="blog-post__comments" href={commentsUri}>
      <div className="blog-post__comments-icon icon icon--balloon-berlin" />
      <div className="blog-post__comments-label">
        {pre}
        {contentNode}
      </div>
    </a>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Comments.propTypes = {
    firstToCommentLabel: React.PropTypes.string.isRequired,
    commentCount: React.PropTypes.number.isRequired,
    commentsUri: React.PropTypes.string,
    viewCommentsLabel: React.PropTypes.string.isRequired,
  };
}
