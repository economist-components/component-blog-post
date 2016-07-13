/* eslint-disable */
import 'babel-polyfill';
import BlogPost from '../src';
import ArticleImage from '../lib/parts/article-image';
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

    it('renders a flytitle', () => {
      post.should.have.className('blog-post')
      .and.have.exactly(1).descendants('.blog-post__flytitle');
      post.find('.blog-post__flytitle').should.have.text(requiredProps.flyTitle);
    });

    it('renders a title', () => {
      post.should.have.exactly(1).descendants('.blog-post__title');
      post.find('.blog-post__title').should.have.tagName('h1');
      post.find('.blog-post__title').should.have.text(requiredProps.title);
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
      post.should.have.exactly(1).descendants('.blog-post__flytitle');
      post.should.have.exactly(1).descendants('.blog-post__title');
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

  describe('images', () => {
    /* eslint-disable max-len */
    const wideExplicit = `
      <p class="xhead">Wide image with explicit measures</p>
      <p>The following image is a "wide" one. the HTML image tag comes with <em>width</em> and <em>height</em> already specified, so we just take them for true and we determine if the image is wide or slim based on those values</p>
      <figure>
        <img id="wide-explicit" src="http://cdn.static-economist.com/sites/default/files/images/2016/05/articles/body/20160528_IRC476.png" alt="" title="" height="732" width="1190"/>
      </figure>
    `;
    const textIntro = `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `;
    const textOuttro = `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `;
    const slimExplicit = `
      <p class="xhead">Slim image with explicit measures</p>
      <p>The following image is a 'slim' one and its dimensions are provided by the HTML content, so we just use them to determine its aspect and style it accordingly. we have also some additional text to flow around it:</p>
      <figure>
        <img id="slim-explicit" src="http://cdn.static-economist.com/sites/default/files/images/2016/07/articles/body/20160709_brp006.jpg" alt="" title="" height="317" width="290"/>
      </figure>
    `;
    /* eslint-enable max-len */
    // subject under test
    let subject = null;

    it('tags wide images according to their attributed measures', () => {
      subject = mountComponentWithProps({
        text: textIntro + wideExplicit + textOuttro
      });
      // check that the image is marked as 'image-type__normal'
      subject.find('#wide-explicit.image-type__normal').should.not.be.null;
    });

    it('tags slim images according to their attributed measures', () => {
      subject = mountComponentWithProps({
        text: textIntro + slimExplicit + textOuttro
      });
      // check that the image is marked as 'image-type__slim'
      subject.find('#slim-explicit.image-type__slim').should.not.be.null;
    });

    it('tags wide images with no measures according to their aspect', () => {
      subject = new ArticleImage({
        src:"http://cdn.static-economist.com/sites/default/files/images/2016/07/articles/body/20160709_brp006.jpg",
      });
      subject.refs = {
        image: {
          naturalWidth: 595,
          naturalHeight: 375
        }
      };
      subject.handleImageLoaded();

      // check that the image is marked as 'normal'
      subject.state.aspectType.should.equal('normal');
    });

    it('tags slim images with no measures according to their aspect', () => {
      subject = new ArticleImage({
        src:"http://cdn.static-economist.com/sites/default/files/images/2016/07/articles/body/20160709_brp006.jpg",
      });
      subject.setState = sinon.spy();
      subject.refs = {
        image: {
          naturalWidth: 290,
          naturalHeight: 515
        }
      };
      subject.handleImageLoaded();

      // check that the image is marked as 'slim'
      subject.setState.should.have.been.calledWith({ aspectType: 'slim', aspectRecomputed: true });
    });

    it('uses the measure in the image if present', () => {
      // using an image with explicit measures, the applyImageAspect function
      // should be called only once (when the component mount and before the
      // first state change)
      subject = new ArticleImage({
        src:"http://cdn.static-economist.com/sites/default/files/images/2016/07/articles/body/20160709_brp006.jpg",
        alt:"",
        height:"317",
        width:"290"
      });
      sinon.spy(ArticleImage.prototype, 'applyImageAspect');
      subject.setState = sinon.spy();

      // when the component mount, it will call applyImageAspect
      subject.componentWillMount();
      
      // check that the image is marked as computed after mount
      subject.applyImageAspect.should.have.been.called;
      subject.setState.should.have.been.calledWith({ aspectRecomputed: true });

      // if handleImageLoaded is called, no additional calls to applyImageAspect are made
      subject.applyImageAspect.reset();
      subject.state.aspectRecomputed = true;
      subject.handleImageLoaded();
      subject.applyImageAspect.should.not.have.been.called;
    });
  });
});

