import React, { PropTypes } from 'react';

export default function Comments({
  commentCount,
  viewCommentsLabel,
  commentsUri,
  hideLabel,
}) {
  return (
    <a className="blog-post__comments" href={commentsUri}>
      <div className="blog-post__comments-icon icon icon--balloon-berlin" />
      {hideLabel ? null : (<div className="blog-post__comments-label">
        <span className={commentCount > 0 ? 'blog-post__comments-contentwrapper' : ''}>
          {viewCommentsLabel}
        </span>
      </div>)}
    </a>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Comments.propTypes = {
    commentCount: PropTypes.number.isRequired,
    commentsUri: PropTypes.string,
    viewCommentsLabel: PropTypes.string.isRequired,
    hideLabel: PropTypes.bool,
  };
}
