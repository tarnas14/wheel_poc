import * as React from 'react'

import './Shadow.sass'
import '../../types/models'

const offset = 85

export default ({wheel, wheelSettings: {shadowSettings: {shadowBelow: settings}}}: {wheel: any[], wheelSettings: WheelSettings}) => <div className='Shadow' style={{
  height: `${settings.height}px`,
  width: `${settings.width}px`,
  marginTop: `${settings.distanceFromTheWheel - offset - settings.height}px`,
  boxShadow: `0px ${settings.height + settings.blurRadius / 2}px ${settings.blurRadius}px rgba(0, 0, 0, ${settings.opacity})`
}}/>
