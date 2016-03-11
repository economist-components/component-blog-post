import BlogPost from '../src';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
chai.should();

describe('BlogPost', () => {
  it('is compatible with React.Component', () => {
    BlogPost.should.be.a('function')
      .and.respondTo('render');
  });
  it('renders a React element', () => {
    React.isValidElement(<BlogPost />).should.equal(true);
  });
  it('renders a section', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        section="section"
        title="Required"
        text="Required"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
    post, 'blog-post__section');
    elm.props.className.should.equal('blog-post__section');
    elm.props.children.should.equal('section');
  });
  it('renders a flytitle', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        flyTitle="flytitle"
        title="Required"
        text="Required"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
    post, 'blog-post__flytitle');
    elm.props.className.should.equal('blog-post__flytitle');
    elm.props.children.should.equal('flytitle');
  });
  it('renders a title', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost title="title" text="Required" />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
    post, 'blog-post__title');
    elm.props.className.should.equal('blog-post__title');
    elm.props.children.should.equal('title');
  });
  it('formats a date', () => {
    const today = new Date(2015, 12 - 1, 15, 20, 18);
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        dateTime={today}
        title="Required"
        text="Required"
      />
    );
    const formattedDate = post.props.dateFormat(post.props.dateTime);
    formattedDate.should.equal('Dec 15th 2015, 20:18');
  });
  it('receives and renders a date string and an ISO timestamp', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        title="Required"
        text="Required"
        dateString="some date, 2015"
        timestampISO="2014-12-31T01:40:30Z"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
      post,
      'blog-post__datetime'
    );
    elm.props.className.should.equal('blog-post__datetime');
    elm.props.children.should.equal('some date, 2015');
    elm.props.dateTime.should.equal('2014-12-31T01:40:30Z');
  });

  it('renders a dateTime', () => {
    const today = new Date();
    function dateFormat(date) {
      return date.toString();
    }
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        dateTime={today}
        title="Required"
        dateFormat={dateFormat}
        text="Required"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
    post, 'blog-post__datetime');
    elm.props.className.should.equal('blog-post__datetime');
    elm.props.children.should.equal(today.toString());
  });
  it('renders a text', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        text="BlogPost text"
        title="Required"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(
      post, 'blog-post__text');
    elm.props.className.should.equal('blog-post__text');
    /* eslint-disable dot-notation */
    elm.props.dangerouslySetInnerHTML['__html'].should.equal('BlogPost text');
  });
  it('can render the text as react "children" as opposed to dangerouslySetInnerHTML', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        text={(<div className="foo" />)}
        title="Required"
      />
    );
    const elm = TestUtils.findRenderedDOMComponentWithClass(post, 'blog-post__text');
    elm.props.children.props.className.should.equal('foo');
  });
  it('renders an image', () => {
    const img = {
      src: '//cdn.static-economist.com/sites/all/themes/econfinal/images/svg/logo.svg',
      alt: 'Example',
    };
    const post = TestUtils.renderIntoDocument(
      <BlogPost image={img}
        title="Required"
        text="Required"
      />);
    const elm = TestUtils.findRenderedDOMComponentWithClass(post, 'blog-post__image-block');
    elm.props.className.should.equal('blog-post__image-block');
    elm.props.src.should.equal('//cdn.static-economist.com/sites/all/themes/econfinal/images/svg/logo.svg');
    elm.props.alt.should.equal('Example');
  });
  it('renders the section name', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        section="test section name"
        title="Required"
        text="Required"
      />);
    const elm = TestUtils.findRenderedDOMComponentWithClass(post, 'blog-post__section');
    elm.props.children.should.equal('test section name');
  });
  it('renders the section link in case of a link', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        section="test section name"
        sectionUrl="foo/bar/baz"
        title="Required"
        text="Required"
      />);
    const elm = TestUtils.findRenderedDOMComponentWithClass(post, 'blog-post__section-link');
    elm.props.href.should.equal('/foo/bar/baz');
    elm.props.children.should.equal('test section name');
  });
  it('also works with links pointing to other domains', () => {
    const post = TestUtils.renderIntoDocument(
      <BlogPost
        section="test section name"
        sectionUrl="http://foo.io/bar/baz"
        title="Required"
        text="Required"
      />);
    const elm = TestUtils.findRenderedDOMComponentWithClass(post, 'blog-post__section-link');
    elm.props.href.should.equal('http://foo.io/bar/baz');
  });
});
