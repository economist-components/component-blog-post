import Balloon from '@economist/component-balloon';
import Icon from '@economist/component-icon';
import MobileDetect from 'mobile-detect';
import React from 'react';
import ShareBar from '@economist/component-sharebar';
import classnames from 'classnames';
import url from 'url';

function generateCopyrightUrl(type, title, publicationDate, contentID) {
  return url.format({
    protocol: 'https:',
    host: 's100.copyright.com',
    pathname: '/AppDispatchServlet',
    query: {
      publisherName: 'economist',
      publication: 'economist',
      title,
      publicationDate,
      contentID,
      type,
      orderBeanReset: 0,
    },
  });
}

function createTrigger(buttonName) {
  return (
    <a href="/Sections">
      <Icon className="blog-post__sharebar-icon-more" icon="more" size="23px" />
      <span className="blog-post__sharebar-word-more">{buttonName}</span>
    </a>
  );
}

/* eslint-disable react/prop-types */
function createSharebar(props, icons, platform) {
  const hasPurchaseRights = icons.includes('purchaseRights');
  if (hasPurchaseRights) {
    const { type, title, publicationDate, contentID, urlOverrides } = props;
    const copyrightUrlOverrides = Object.assign({}, urlOverrides, {
      purchaseRights: generateCopyrightUrl(
        type,
        title,
        publicationDate,
        contentID
      ),
    });
    const propData = Object.assign({}, props, { urlOverrides: copyrightUrlOverrides });
    return (
      <div
        className={`blog-post__sharebar-${ platform }`}
        style={type ? { fontSize: '30px' } : {}}
      >
        <ShareBar icons={icons} {...propData} />
      </div>
    );
  } else { // eslint-disable-line no-else-return
    return (
      <ShareBar icons={icons} {...props} />
    );
  }
}
/* eslint-enable react/prop-types */

export default function BlogPostShareBar(props) {
  let isMobile = false;
  let deviceIcons = [];
  if (typeof window !== 'undefined') {
    isMobile = new MobileDetect(window.navigator.userAgent).mobile() !== null; // eslint-disable-line no-undef
  }
  deviceIcons = isMobile ? props.mobileIcons : props.desktopIcons;

  const platform = isMobile ? 'mobile' : 'desktop';
  return (
    <div className="blog-post__sharebar">
      {createSharebar(props, deviceIcons.filter((value) => typeof value === 'string'), platform)}
      {deviceIcons.filter((value) => typeof value === 'object')
        .map((balloon, i) => (
          <Balloon
            key={`blog-post__sharebar-balloon-${ i }`}
            className={classnames(
              'blog-post__toggle-share',
              { 'blog-post__toggle-share-mobile': isMobile }
            )}
            shadow={false}
            trigger={createTrigger(balloon.buttonName)}
          >
            {createSharebar(props, balloon.icons, platform)}
          </Balloon>
        ))
      }
    </div>
  );
}

BlogPostShareBar.defaultProps = {
  desktopIcons: [ 'twitter', 'facebook', {
    buttonName: 'More',
    icons: [ 'linkedin', 'googleplus', 'mail', 'print', 'purchaseRights' ],
  },
  ],
  mobileIcons: [ 'twitter', 'facebook', {
    buttonName: 'More',
    icons: [ 'linkedin', 'googleplus', 'mail', 'whatsapp', 'purchaseRights' ],
  },
  ],
  urlOverrides: { mail: 'mailto:?body=' },
};

export function getIconsPropTypes() {
  return React.PropTypes.arrayOf(React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.shape({
      buttonName: React.PropTypes.string.isRequired,
      icons: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    }),
  ]));
}

if (process.env.NODE_ENV !== 'production') {
  BlogPostShareBar.propTypes = {
    id: React.PropTypes.string,
    type: React.PropTypes.oneOf([ 'BL', 'A' ]),
    title: React.PropTypes.string,
    flyTitle: React.PropTypes.string,
    publicationDate: React.PropTypes.string,
    desktopIcons: getIconsPropTypes(),
    mobileIcons: getIconsPropTypes(),
    urlOverrides: React.PropTypes.objectOf(React.PropTypes.string),
  };
}
