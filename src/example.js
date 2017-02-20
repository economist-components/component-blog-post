import BlogPost from './';
import React from 'react';
import postText from './example-post-text';

const today = new Date();
export default (
  <div>
    <BlogPost
      image={{
        src: 'http://cdn.static-economist.com/sites/default/files/imagecache/full-width/20151017_BLP560.jpg',
        title: 'Just an image',
      }}
      section="International"
      flyTitle="The UN, religion and development"
      title="Faith and secular global bodies learn to live together"
      rubric="A different critique was put forward recently by a representative of the Bahai faith, which originated in 19th century Persia but is now flourishing in smallish pockets throughout the world, while facing persecution in its homeland." // eslint-disable-line max-len
      dateTime={today}
      text={postText}
      itemType="http://schema.org/BlogPosting"
      itemProp="blogPost"
      commentCount={20}
      commentsUri="https://google.com"
      commentStatus="readwrite"
    />
  </div>
);
