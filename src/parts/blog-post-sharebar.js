import Balloon from '@economist/component-balloon';
import Icon from '@economist/component-icon';
import MobileDetect from 'mobile-detect';
import React from 'react';
import ShareBar from '@economist/component-sharebar';
import classnames from 'classnames';

const DesktopProviders = (
  <div className="blog-post__sharebar-desktop">
    <ShareBar
      icons={[ 'linkedin', 'googleplus', 'mail', 'print' ]}
      urlOverrides={{ mail: 'mailto:?body=' }}
    />
  </div>
);
const MobileProviders = (
  <div className="blog-post__sharebar-mobile">
    <ShareBar
      icons={[
        'linkedin',
        'googleplus',
        'mail',
        'whatsapp',
      ]}
      urlOverrides={{ mail: 'mailto:?body=' }}
    />
  </div>
);
export default function BlogPostSideBar() {
  const shareBarTrigger = (
    <a href="/Sections">
      <Icon className="blog-post__sharebar-icon-more" icon="more" size="23px" />
      <span className="blog-post__sharebar-word-more">More</span>
    </a>
  );

  let isMobile = false;
  if (typeof window !== 'undefined') {
    /* global window:false */
    const mobileDetector = new MobileDetect(window.navigator.userAgent);
    isMobile = mobileDetector.mobile() !== null;
  }

  return (
    <div className="blog-post__sharebar">
      <ShareBar icons={[ 'twitter', 'facebook' ]} />
      <Balloon
        className={classnames(
          'blog-post__toggle-share',
          { 'blog-post__toggle-share-mobile': isMobile }
        )}
        shadow={false}
        trigger={shareBarTrigger}
      >
      {isMobile ? MobileProviders : DesktopProviders}
      </Balloon>
    </div>
  );
}
