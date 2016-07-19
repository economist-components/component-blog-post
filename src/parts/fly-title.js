import React from 'react';

function FlyTitle({ title, flyTitle }) {
  return (
    <h2
      className="blog-post__title"
      itemProp="alternativeHeadline"
    >
      <span className="blog-post__flytitle">{flyTitle}</span>
      <br></br>
      {title}
    </h2>
  );
}

FlyTitle.propTypes = {
  title: React.PropTypes.string.isRequired,
  flyTitle: React.PropTypes.string.isRequired,
};

export default FlyTitle;
