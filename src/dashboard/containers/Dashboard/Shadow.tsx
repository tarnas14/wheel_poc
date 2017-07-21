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

const modifierValue = (value: number, modifier: any) => modifier.use
  ? value * modifier.value
  : 1

export default ({wheel, settings, modifiers, animationSetting}: {wheel: any[], settings: any, modifiers: any, animationSetting: any}) => <Motion defaultStyle={defaultStyle}
  style={settings.enabled
    ? {
      height: spring(modifierValue(wheel.length, modifiers.height) * settings.height, animationSetting),
      width: spring(modifierValue(wheel.length, modifiers.width) * settings.width, animationSetting),
      blurRadius: spring(modifierValue(wheel.length, modifiers.blurRadius) * settings.blurRadius, animationSetting),
      opacity: spring(modifierValue(wheel.length, modifiers.opacity) * settings.opacity, animationSetting),
      distanceFromTheWheel: spring(modifierValue(wheel.length, modifiers.distanceFromTheWheel) * settings.distanceFromTheWheel, animationSetting)
    }
    : defaultStyle
  }
>
  {value => <div className='Shadow' style={{
    height: `${value.height}px`,
    width: `${value.width}px`,
    marginTop: `${value.distanceFromTheWheel - offset - value.height}px`,
    boxShadow: `0px ${value.height + value.blurRadius}px ${value.blurRadius}px rgba(0, 0, 0, ${value.opacity})`
  }}/>}
</Motion>
