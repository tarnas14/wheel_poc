import * as React from 'react'
import {Motion, spring} from 'react-motion'

import './Shadow.sass'
import '../../types/models'

const offset = 85

const defaultStyle = {
    height: 0,
    width: 0,
    blurRadius: 0,
    opacity: 0,
    distanceFromTheWheel: 0
}

export default ({wheel, settings, animationSetting}: {wheel: any[], settings: any, animationSetting: any}) => <Motion defaultStyle={defaultStyle}
  style={settings.enabled
    ? {
      height: spring(settings.height, animationSetting),
      width: spring(settings.width, animationSetting),
      blurRadius: spring(settings.blurRadius, animationSetting),
      opacity: spring(settings.opacity, animationSetting),
      distanceFromTheWheel: spring(settings.distanceFromTheWheel, animationSetting)
    }
    : defaultStyle
  }
>
  {value => <div className='Shadow' style={{
    height: `${value.height}px`,
    width: `${value.width}px`,
    marginTop: `${value.distanceFromTheWheel - offset - value.height}px`,
    boxShadow: `0px ${value.height + value.blurRadius / 2}px ${value.blurRadius}px rgba(0, 0, 0, ${value.opacity})`
  }}/>}
</Motion>
