import React from 'react';

export default function Comments({
  commentCount,
  viewCommentsLabel,
  commentsUri,
}) {
  return (
    <a className="blog-post__comments" href={commentsUri}>
      <div className="blog-post__comments-icon icon icon--balloon-berlin" />
      <div className="blog-post__comments-label">
        <span className={commentCount > 0 ? 'blog-post__comments-contentwrapper' : ''}>
          {viewCommentsLabel}
        </span>
      </div>
    </a>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Comments.propTypes = {
    commentCount: React.PropTypes.number.isRequired,
    commentsUri: React.PropTypes.string,
    viewCommentsLabel: React.PropTypes.string.isRequired,
  };
}
