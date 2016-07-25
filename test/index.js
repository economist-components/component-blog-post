/* eslint-disable */
import 'babel-polyfill';
import BlogPost from '../src';
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
  text: 'Required text',
  title: 'Required title',
  commentCount: 10,
  commentsUri: 'http://google.com',
  viewCommentsLabel: 'foo',
  commentStatus: 'readwrite',
  TitleComponent: ({ flyTitle, title }) => (<div className="test-title-component">test: {flyTitle} {title}</div>),
};

const mountComponentWithProps = mountComponent(requiredProps);
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

  describe('Comments', () => {
    it('renders the comments (#comments > 0)', () => {
      const post = mountComponentWithProps({ commentCount: 10 });
      post.should.have.exactly(1).descendants('.blog-post__comments');
      post.find('.blog-post__comments').should.have.attr('href', requiredProps.commentsUri);
      post.find('.blog-post__comments-label')
      .should.have.text('foo (10)');
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
        const twitterShareLinkNode = post.find('.share__icon--twitter').find('a');
        twitterShareLinkNode.should.have.attr('href', 'https://twitter.com/intent/tweet?url=');
        const facebookShareLinkNode = post.find('.share__icon--facebook').find('a');
        facebookShareLinkNode.should.have.attr('href', 'http://www.facebook.com/sharer/sharer.php?u=');
      });

      it('should show the other providers when clicking on the share button', () => {
        const post = mountComponentWithProps();
        const shareBalloonNode = post.find('.blog-post__toggle-share');
        const balloonContentNode = shareBalloonNode.find('.balloon-content');
        shareBalloonNode.should.have.className('balloon--not-visible');
        shareBalloonNode.find('a.balloon__link').simulate('click');
        shareBalloonNode.should.have.className('balloon--visible');

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

    describe('mobile', () => {
      before(function () {
        if (!mobileDetector.mobile()) {
          this.skip(); // eslint-disable-line no-invalid-this
        }
      });

      it('should show the mobile providers', () => {
        const post = mountComponentWithProps();
        const shareBalloonNode = post.find('.blog-post__toggle-share-mobile');
        const balloonContentNode = shareBalloonNode.find('.balloon-content');
        balloonContentNode.should.have.exactly(1).descendants('.share__icon--twitter');
        balloonContentNode.find('.share__icon--twitter').find('a')
          .should.have.attr('href', 'https://twitter.com/intent/tweet?url=');

        balloonContentNode.should.have.exactly(1).descendants('.share__icon--facebook');
        balloonContentNode.find('.share__icon--facebook').find('a')
          .should.have.attr('href', 'http://www.facebook.com/sharer/sharer.php?u=');

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
