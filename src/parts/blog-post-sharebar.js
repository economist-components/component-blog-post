import Balloon from '@economist/component-balloon';
import Icon from '@economist/component-icon';
import MobileDetect from 'mobile-detect';
import React from 'react';
import ShareBar from '@economist/component-sharebar';
import classnames from 'classnames';
import url from 'url';

const generateCopyrightUrl = (type, title, publicationDate, contentID) => (
  url.format({
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
  })
)

const createTrigger = buttonName => (
  <a href="/Sections">
    <Icon className="blog-post__sharebar-icon-more" icon="more" size="23px" />
    <span className="blog-post__sharebar-word-more">{buttonName}</span>
  </a>
);

const createSharebar = (props, platform) => {
  const hasPurchaseRights = props.icons.includes('purchaseRights');
  if(hasPurchaseRights) {
    const { type, title, publicationDate, contentID } = props;
    props.urlOverrides.purchaseRights = generateCopyrightUrl(
      type,
      title,
      publicationDate,
      contentID
    );
    return (
      <div
        className={`blog-post__sharebar-${ platform }`}
        style={props.type ? { fontSize: '30px' } : {}}
      >
        <ShareBar {...props}/>
      </div>
    );
  } else {
    return (
      <ShareBar {...props} />
    );
  }
}

export default function BlogPostShareBar(props) {

  //TODO: check on caching this information
  let isMobile = false;
  let deviceIcons = [];
  if (typeof window !== 'undefined') {
    isMobile = new MobileDetect(window.navigator.userAgent).mobile() !== null;
  }
  deviceIcons = isMobile ? props.mobileIcons : props.desktopIcons;

  const rootSharebarProps = {
    ...props,
    icons: deviceIcons.filter(value => typeof value === 'string'),
  }

  const platform = isMobile ? 'mobile' : 'desktop';

  return (
    <div className="blog-post__sharebar">
      {createSharebar(rootSharebarProps, platform)}
      {deviceIcons.filter(value => typeof value === 'object')
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
            {createSharebar({...props, icons: balloon.icons}, platform)}
          </Balloon>
        ))
      }
    </div>
  );
}

BlogPostShareBar.defaultProps = {
  desktopIcons: ['twitter', 'facebook', {
      buttonName: 'More',
      icons: ['linkedin', 'googleplus', 'mail', 'print', 'purchaseRights']
    }
  ],
  mobileIcons: ['twitter', 'facebook', {
      buttonName: 'More',
      icons: ['linkedin', 'googleplus', 'mail', 'whatsapp', 'purchaseRights']
    }
  ],
  urlOverrides: { mail: 'mailto:?body=' },
};

if (process.env.NODE_ENV !== 'production') {
  BlogPostShareBar.propTypes = {
    id: React.PropTypes.string,
    type: React.PropTypes.oneOf(['BL', 'A']), // make into string maybe?
    title: React.PropTypes.string,
    flyTitle: React.PropTypes.string,
    publicationDate: React.PropTypes.string,
    desktopIcons: React.PropTypes.array, //TODO: make into recursive array
    mobileIcons: React.PropTypes.array, //TODO: make into recursive array
    urlOverrides: React.PropTypes.object, //TODO: change to shape
  };
}
