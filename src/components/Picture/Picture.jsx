import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ImgixClient from '@imgix/js-core'
import LazyLoad from 'react-lazyload'
import globals from '../../globals'

const ROOT_PATH = 'saatva-imgix-poc.imgix.net'

const DEVICES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
}

const DEVICE_FILE_SPECIFIERS = {
  UNIVERSAL: 'u-',
  MOBILE: 'm-',
  TABLET: 't-',
  DESKTOP: 'd-'
}

/* 
   * Unsure if this is the proper place for the client declaration,
   * But it appears as though it's fine to put here and reinstantiate every time 
   */
const imgClient = new ImgixClient({
  domain: ROOT_PATH,
})

const ImgixPicture = ({
  imgName,
  imgFolder,
  imgExtension,
  altText,
  containerClasses,
  imageClasses,
  imgixParams,
  targetedDevices,
  useLazyLoad,
  hasHoverImage,
  hasBreakpointImages,
  showCode,
  ...other
}) => {

  const [showHoverImage, setShowHoverImage] = useState(false)
  
  const toggleHover = () => {
    setShowHoverImage(!showHoverImage)
  }
  
  const sources = hasHoverImage 
    ? generateHoverSources(imgName, imgFolder, imgExtension, imgixParams) 
    : generateSources(imgName, imgFolder, imgExtension, imgixParams) 

  const isDeviceAgnostic = (targetedDevices.length === 0)
  const normalizedTargetedDevices = targetedDevices.map(device => device.toLowerCase())
  const includeMobile = normalizedTargetedDevices.includes(DEVICES.MOBILE)
  const includeTablet = normalizedTargetedDevices.includes(DEVICES.TABLET)
  const includeDesktop = normalizedTargetedDevices.includes(DEVICES.DESKTOP)
  const imageElementClasses = classNames(imageClasses)

  const mobileClassNames = classNames(imageElementClasses, {
    'u-hidden--sm-up': includeTablet,
    'u-hidden--md-up': !includeTablet && includeDesktop
  })
  const tabletClassNames = classNames(imageElementClasses, {
      'u-hidden--md-up': includeDesktop,
      'u-hidden--sm-down': includeMobile
  })
  const desktopClassNames = classNames(imageElementClasses, {
      'u-hidden--md-down': includeTablet || includeMobile
  })
  //
  const tabletMedia = includeMobile ? `(min-width: ${globals.breakpoints.sm}px)` : ''
  const desktopMedia = includeTablet
    ? `(min-width: ${globals.breakpoints.lg}px)`
    : includeMobile
      ? `(min-width: ${globals.breakpoints.sm}px)`
      : ''

  const alt = altText ? altText : imgName

  const pictureElement = (
      <picture className={containerClasses} {...other} onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        {/* Default sourceset attributes  */}
        { isDeviceAgnostic &&
          <source srcSet={showHoverImage ? sources.universal.hoverSrcSet : sources.universal.srcSet} type={`image/${imgExtension}`} />
        }
        { includeDesktop &&
          <source srcSet={showHoverImage ? sources.desktop.hoverSrcSet : sources.desktop.srcSet} media={desktopMedia} type={`image/${imgExtension}`} />
        }
        { includeTablet &&
          <source srcSet={showHoverImage ? sources.tablet.hoverSrcSet : sources.tablet.srcSet} media={tabletMedia} type={`image/${imgExtension}`} />
        }
        { includeMobile &&
          <source srcSet={showHoverImage ? sources.mobile.hoverSrcSet : sources.mobile.srcSet} type={`image/${imgExtension}`} />
        }
        {/* Fallback sourceset attributes for browsers that don't support <picture></picture> */}
        { isDeviceAgnostic &&
          <img 
            className={imageClasses}
            src={sources.universal.source}
            srcSet={sources.universal.srcSet}
            alt={alt}
            title={imgName}
          />
        }
        { includeDesktop &&
          <img 
            className={desktopClassNames}
            src={sources.desktop.source}
            srcSet={sources.desktop.srcSet}
            alt={alt}
            title={imgName}
          />
        }
        { includeTablet &&
          <img 
            className={tabletClassNames}
            src={sources.tablet.source}
            srcSet={sources.tablet.srcSet}
            alt={alt}
            title={imgName}
          />
        }
        { includeMobile &&
          <img 
            className={mobileClassNames}
            src={sources.mobile.source}
            srcSet={sources.mobile.srcSet}
            alt={alt}
            title={imgName}
          />
        }
      </picture>
  )
  
  if (useLazyLoad) {
    return (
      <LazyLoad offset={200} once>{pictureElement}</LazyLoad>
    )
  } else {
    return pictureElement
  }
}

const generateSources = (imgName, imgFolder, imgExtension, imgixParams) => {
    return {
      universal: {
        source: generateSource(imgName, imgFolder, imgExtension, imgixParams),
        srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams)
      },
      mobile: {
        source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE),
        srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE)
      },
      tablet: {
        source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET),
        srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET)
      },
      desktop: {
        source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP),
        srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP)
      }
    }
}

const generateHoverSources = (imgName, imgFolder, imgExtension, imgixParams) => {
  return {
    universal: {
      source: generateSource(imgName, imgFolder, imgExtension, imgixParams, '', true, false),
      srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, '', true, false),
      hoverSource: generateSource(imgName, imgFolder, imgExtension, imgixParams, '', true, true),
      hoverSrcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, '', true, false)
    },
    mobile: {
      source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE, true, false),
      srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE, true, false),
      hoverSource: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE, true, true),
      hoverSrcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.MOBILE, true, true)
    },
    tablet: {
      source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET, true, false),
      srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET, true, false),
      hoverSource: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET, true, true),
      hoverSrcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.TABLET, true, true)
    },
    desktop: {
      source: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP, true, false),
      srcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP, true, false),
      hoverSource: generateSource(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP, true, true),
      hoverSrcSet: generateSrcSet(imgName, imgFolder, imgExtension, imgixParams, DEVICES.DESKTOP, true, true)
    }
  }
}

const generateSource = (imgName, imgFolder, imgExtension, imgixParams, device = '', useHover, hover) => {
  const deviceSpecifier = device 
    ? DEVICE_FILE_SPECIFIERS[device.toUpperCase()]
    : ''

  const folder = imgFolder ? imgFolder : ''
  const hoverAddon = !useHover ? '' : (hover ? '-01' : '-02')

  const sourcePath = `${folder}/${deviceSpecifier}${imgName}${hoverAddon}.${imgExtension}`

  return imgClient.buildURL(sourcePath, imgixParams)
}

const generateSrcSet = (imgName, imgFolder, imgExtension, imgixParams, device = '', useHover, hover) => {
  const deviceSpecifier = device
    ? DEVICE_FILE_SPECIFIERS[device.toUpperCase()]
    : ''

  const folder = imgFolder ? imgFolder : '' 
  const hoverAddon = !useHover ? '' : (hover ? '-01' : '-02')

  const sourcePath = `${folder}/${deviceSpecifier}${imgName}${hoverAddon}.${imgExtension}`
  
  return imgClient.buildSrcSet(sourcePath, imgixParams)
}

ImgixPicture.propTypes = {
  imgName: PropTypes.string,
  imgFolder: PropTypes.string,
  imgExtension: PropTypes.string,
  altText: PropTypes.string,
  containerClasses: PropTypes.string,
  imageClasses: PropTypes.string,
  imgixParams: PropTypes.object,
  targetedDevices: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(DEVICES))
  ).isRequired,
  useLazyLoad: PropTypes.bool,
  hasHoverImage: PropTypes.bool,
  hasBreakpointImages: PropTypes.bool,
}

ImgixPicture.defaultProps = {
  targetedDevices: Object.values(DEVICES),
}

export default ImgixPicture