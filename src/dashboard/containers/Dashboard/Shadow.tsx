import * as React from 'react'

import './Shadow.sass'
import '../../types/models'

const offset = 85

export default ({wheel, wheelSettings: {shadowSettings: {shadowBelow: settings}}}: {wheel: any[], wheelSettings: WheelSettings}) => <div className='Shadow' style={{
  height: `${settings.height}px`,
  width: `${settings.width}px`,
  marginTop: `${settings.distanceFromTheWheel - offset}px`,
  boxShadow: `0px 50px ${settings.blurRadius}px rgba(0, 0, 0, ${settings.opacity})`
}}/>
