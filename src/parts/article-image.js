import React from 'react';

/**
 * This component models an inline image occurring within an article
 **/
class ArticleImage extends React.Component {
  constructor(props) {
    super(props);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.state = {
      aspectType: 'normal',
      aspectRecomputed: false,
    };
  }

  componentWillMount() {
    const { width = '0', height = '0' } = this.props;
    // if the image has already got dimension attrs, we can immediately apply
    // the aspect adjustments (if any)
    const nWidth = parseInt(width, 10) || 0;
    const nHeight = parseInt(height, 10) || 0;
    if (nWidth && nHeight) {
      this.applyImageAspect(nWidth, nHeight);
      // setting the state as recomputed will avoid unnecessary recomputations when
      // the image is loaded
      this.setState({ aspectRecomputed: true });
    }
  }

  handleImageLoaded() {
    // if the aspect recomputation has been already done,
    // just return.
    if (this.state.aspectRecomputed) {
      return;
    }
    this.applyImageAspect(this.refs.image.naturalWidth, this.refs.image.naturalHeight);
  }

  applyImageAspect(width, height) {
    // if the image is taller than wider, then it's a slim one
    if (height > width) {
      // tag the image as 'slim'
      this.setState({ aspectType: 'slim', aspectRecomputed: true });
    }
  }

  render() {
    const { className = '' } = this.props;
    const imageClass = `${ className } blog-post-article-image blog-post-article-image__${ this.state.aspectType }`;
    return (
      <img
        ref="image"
        className={imageClass}
        {...this.props}
        onLoad={this.handleImageLoaded}
      />
    );
  }
}


ArticleImage.propTypes = {
  alt: React.PropTypes.string,
  caption: React.PropTypes.element,
  src: React.PropTypes.string.isRequired,
  width: React.PropTypes.string,
  height: React.PropTypes.string,
  className: React.PropTypes.string,
};

export default ArticleImage;
