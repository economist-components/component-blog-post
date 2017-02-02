/* eslint-disable */
import 'babel-polyfill';
import BlogPost, { generateBlogPostFlyTitle } from '../src';
import MobileDetect from 'mobile-detect';
import React from 'react';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
chai.use(chaiEnzyme()).should();
chai.use(sinonChai);

function mountComponent(requiredProps) {
  return function (additionalProps) {
    return mount(<BlogPost {...requiredProps} {...additionalProps} />);
  };
}

const requiredProps = {
  flyTitle: 'Required flyTitle',
  section: 'Required section',
  text: [
    "paragraph 1 paragraph 1 paragraph 1",
    "paragraph 2 paragraph 2 paragraph 2",
    "paragraph 3 paragraph 3 paragraph 3",
    "paragraph 4 paragraph 4 paragraph 4",
  ],
  title: 'Required title',
  type: 'blog',
  id: 'test blog',
  publicationDate: '01/02/03',
  commentCount: 10,
  commentsUri: 'http://google.com',
  viewCommentsLabel: 'foo',
  commentStatus: 'readwrite',
  elementClassName: 'blog-post__classname',
  sectionName: 'Section name',
  TitleComponent: ({ flyTitle, title }) => (<div className="test-title-component">test: {flyTitle} {title}</div>),
};

const otherProps = {
  flyTitle: 'Other flyTitle',
  section: 'Other section',
  text: 'Other text',
  title: 'Other title',
  type: 'blog',
  id: 'test blog',
  publicationDate: '02/03/04',
  commentCount: 10,
  commentsUri: 'http://google.com',
  viewCommentsLabel: 'foo',
  commentStatus: 'readwrite',
  issueSiblingsList: [
    {key: '1', flyTitle: 'flytitle1', title: 'title1', webURL: 'www.1.com'},
    {key: '2', flyTitle: 'flytitle2', title: 'title2', webURL: 'www.2.com'},
    {key: '3', flyTitle: 'flytitle3', title: 'title3', webURL: 'www.3.com'},
  ],
  showSiblingArticlesList: true,
  elementClassName: 'blog-post__classname',
  sectionName: 'Special report',
  sideText: 'More in this report',
  TitleComponent: ({ flyTitle, title }) => (<div className="test-title-component">test: {flyTitle} {title}</div>),
  text: [
    "paragraph 1 paragraph 1 paragraph 1",
    "paragraph 2 paragraph 2 paragraph 2",
    "paragraph 3 paragraph 3 paragraph 3",
    "paragraph 4 paragraph 4 paragraph 4",
  ],
}

const mountComponentWithProps = mountComponent(requiredProps);
const mountComponentWithOtherProps = mountComponent(otherProps)
describe('BlogPost', () => {
  it('is compatible with React.Component', () => {
    BlogPost.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<BlogPost {...requiredProps} />).should.equal(true);
  });

  describe('Simple rendering', () => {
    let post = null;
    before(() => {
      post = mountComponentWithProps();
    });

    it('renders a section', () => {
      post.should.have.exactly(1).descendants('.blog-post__section');
      post.find('.blog-post__section').should.have.text(requiredProps.section);
      post.find('.blog-post__section').should.have.tagName('h3');
    });

    it('renders a title component', () => {
      post.should.have.className('blog-post')
      .and.have.exactly(1).descendants('.test-title-component');
    });

    it('renders a text', () => {
      post.should.have.exactly(1).descendants('.blog-post__text');
      post.find('.blog-post__text').should.have.text(requiredProps.text);
    });

    it('renders the section name', () => {
      post.find('.blog-post__section').should.have.text(requiredProps.section);
    });

  });

  describe('Blog post siblings list', () => {
    let post = null;
    before(() => {
      post = mountComponentWithOtherProps();
    });

    it('renders sideText given from props', () => {
      post.find('.blog-post__side-text').should.have.text(otherProps.sideText);
    });

    it('renders a list of siblings', () => {
      post.find('.blog-post__siblings-list').should.have.exactly(3).descendants('.blog-post__siblings-list-article');
      post.find('.blog-post__siblings-list').should.have.tagName('ul');
    });
  });

  describe('Generate blog post flyTitle', () => {
    it('should generate just the report title if flytitle is the same', () => {
      const blogPostFlyTitle = generateBlogPostFlyTitle(true, "report title", "report title");
      blogPostFlyTitle.should.equal("report title");
    });

    it('should return the report title and flyTitle if they are different', () => {
      const blogPostFlyTitle = generateBlogPostFlyTitle(true, "report title", "flyTitle");
      blogPostFlyTitle.should.equal("report title: flyTitle");
    })
  });

  describe('Comments', () => {
    it('renders the comments (#comments > 0)', () => {
      const post = mountComponentWithProps({
        commentCount: 10,
        viewCommentsLabel: 'foo'
      });
      post.should.have.exactly(1).descendants('.blog-post__comments');
      post.find('.blog-post__comments').should.have.attr('href', requiredProps.commentsUri);
      post.find('.blog-post__comments-label')
      .should.have.text('foo');
    });

    it('renders the comments (#comments = 0)', () => {
      const post = mountComponentWithProps({ commentCount: 0 });
      post.should.have.exactly(1).descendants('.blog-post__comments');
      post.find('.blog-post__comments').should.have.attr('href', requiredProps.commentsUri);
      post.find('.blog-post__comments-label').should.have.text('Be the first to comment');
    });

    it('hides the comments when comments are disabled', () => {
      const post = mountComponentWithProps({ commentStatus: 'disabled' });
      post.should.not.have.descendants('.blog-post__comments');
    });

    it('hides the comments when #comments = 0 and comments are closed', () => {
      const post = mountComponentWithProps({ commentStatus: 'readonly', commentCount: 0 });
      post.should.not.have.descendants('.blog-post__comments');
    });

  });

  it('formats a date', () => {
    const today = new Date(2015, 12 - 1, 15, 20, 18);
    const post = mountComponentWithProps({ dateTime: today });
    post.should.have.exactly(1).descendants('.blog-post__datetime');
    post.find('.blog-post__datetime').should.have.tagName('time');
    post.find('.blog-post__datetime').should.have.text('Dec 15th 2015, 20:18');
  });

  it('receives and renders a date string and an ISO timestamp', () => {
    const post = mountComponentWithProps({
      dateString: 'some date, 2015',
      timestampISO: '2014-12-31T01:40:30Z',
    });
    post.should.have.exactly(1).descendants('.blog-post__datetime');
    post.find('.blog-post__datetime').should.have.tagName('time');
    post.find('.blog-post__datetime').should.have.text('some date, 2015');
    post.find('.blog-post__datetime').should.have.attr('datetime', '2014-12-31T01:40:30Z');
  });

  it('renders a dateTime', () => {
    const today = new Date();
    function dateFormat(date) {
      return date.toString();
    }
    const post = mountComponentWithProps({
      dateFormat,
      dateTime: today,
    });
    post.should.have.exactly(1).descendants('.blog-post__datetime');
    post.find('.blog-post__datetime').should.have.tagName('time');
    post.find('.blog-post__datetime').should.have.text(today.toString());
  });

  it('does not render a location created when none is provided', () => {
    const post = mountComponentWithProps({
      locationCreated: '',
    });
    post.should.not.have.descendants('.blog-post__location-created');
  });

  it('renders a location created', () => {
    const post = mountComponentWithProps({
      locationCreated: 'Paris',
    });
    post.should.have.exactly(1).descendants('.blog-post__location-created');
    post.find('.blog-post__location-created').should.have.tagName('span');
    post.find('.blog-post__location-created').should.have.text(' | Paris');
  });

  it('can render the text as react "children" as opposed to dangerouslySetInnerHTML', () => {
    const post = mountComponentWithProps({ text: <div className="foo" /> });
    post.find('.blog-post__text').should.have.exactly(1).descendants('.foo');
  });

  it('renders an image', () => {
    const image = {
      src: '//cdn.static-economist.com/sites/all/themes/econfinal/images/svg/logo.svg',
      alt: 'Example',
      caption: 'Image caption',
    };
    const post = mountComponentWithProps({ image });
    post.should.have.exactly(1).descendants('.blog-post__image-block');
    post.find('.blog-post__image-block').should.have.attr('src')
      .equal('//cdn.static-economist.com/sites/all/themes/econfinal/images/svg/logo.svg');
    post.find('.blog-post__image-block').should.have.attr('alt', 'Example');
  });

  it('renders the section link in case of a link', () => {
    const post = mountComponentWithProps({ sectionUrl: 'foo/bar/baz' });
    post.find('.blog-post__section-link').should.have.attr('href', '/foo/bar/baz');
    post.find('.blog-post__section-link').should.have.text(requiredProps.section);
  });

  it('also works with links pointing to other domains', () => {
    const post = mountComponentWithProps({ sectionUrl: 'http://foo.io/bar/baz' });
    post.find('.blog-post__section-link').should.have.attr('href', 'http://foo.io/bar/baz');
  });

  describe('Invalid props', () => {
    it('should render when `props.image` is null', () => {
      const post = mountComponentWithProps({ image: null });
      post.should.have.exactly(1).descendants('.blog-post__text');
      post.should.not.have.descendants('.blog-post__image');
    });
  });

  describe('Sharebar', () => {
    let mobileDetector = null;
    before(() => {
      /* global window:false */
      mobileDetector = new MobileDetect(window.navigator.userAgent);
    });

    describe('desktop', () => {
      before(function () {
        if (mobileDetector.mobile()) {
          this.skip(); // eslint-disable-line no-invalid-this
        }
      });

      it('should feature the twitter and facebook share buttons', () => {
        const post = mountComponentWithProps();
        post.find('.share__icon--twitter').find('a').forEach(function (node) {
          node.should.have.attr('href', 'https://twitter.com/intent/tweet?url=');
        });
        post.find('.share__icon--facebook').find('a').forEach(function (node) {
          node.should.have.attr('href', 'http://www.facebook.com/sharer/sharer.php?u=');
        });
      });

      it('should show the other providers when clicking on the share button', () => {
        const post = mountComponentWithProps();

        post.find('.blog-post__toggle-share').forEach(function (node) {
          node.should.have.className('balloon--not-visible');
          node.find('a.balloon__link').simulate('click');
          node.should.have.className('balloon--visible');
          const balloonContentNode = node.find('.balloon-content');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--linkedin');
          balloonContentNode.find('.share__icon--linkedin').find('a')
            .should.have.attr('href', 'https://www.linkedin.com/cws/share?url=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--googleplus');
          balloonContentNode.find('.share__icon--googleplus').find('a')
            .should.have.attr('href', 'https://plus.google.com/share?url=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--mail');
          balloonContentNode.find('.share__icon--mail').find('a')
            .should.have.attr('href', 'mailto:?body=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--print');
          balloonContentNode.find('.share__icon--print').find('a')
            .should.have.attr('href', 'javascript:if(window.print)window.print()'); // eslint-disable-line no-script-url
        });
      });
    });

    describe('mobile', () => {
      before(function () {
        if (!mobileDetector.mobile()) {
          this.skip(); // eslint-disable-line no-invalid-this
        }
      });

      it('shows some share providers outside the more menu', () => {
        const post = mountComponentWithProps();
        post.find('.share__icon--twitter').find('a').forEach(function (node) {
          node.should.have.attr('href', 'https://twitter.com/intent/tweet?url=');
        });
        post.find('.share__icon--facebook').find('a').forEach(function (node) {
          node.should.have.attr('href', 'http://www.facebook.com/sharer/sharer.php?u=');
        });
      });

      it('should show the mobile providers', () => {
        const post = mountComponentWithProps();

        post.find('.blog-post__toggle-share-mobile').forEach(function (node) {
          const balloonContentNode = node.find('.balloon-content');
          balloonContentNode.should.have.exactly(1).descendants('.share__icon--linkedin');
          balloonContentNode.find('.share__icon--linkedin').find('a')
            .should.have.attr('href', 'https://www.linkedin.com/cws/share?url=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--googleplus');
          balloonContentNode.find('.share__icon--googleplus').find('a')
            .should.have.attr('href', 'https://plus.google.com/share?url=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--mail');
          balloonContentNode.find('.share__icon--mail').find('a')
            .should.have.attr('href', 'mailto:?body=');

          balloonContentNode.should.have.exactly(1).descendants('.share__icon--whatsapp');
          balloonContentNode.find('.share__icon--whatsapp').find('a')
            .should.have.attr('href', 'whatsapp://send?text=');
        });

      });
    });
  });
});
