import * as React from 'react'
import State from '../../constants/state'

export default ({action, wheel, activeRadius, wheelOrigin, cdRadius, scale, colourPalette}) => {
    const radius = scale * cdRadius.inner * 1.1
    const x = scale * (wheelOrigin.x - radius + activeRadius * 0.35)
    const y = scale * (wheelOrigin.y - radius + activeRadius * 0.35)

    return <div style={{
      cursor: 'pointer',
      borderRadius: '50%',
      position: 'absolute',
      width: `${radius*2}px`,
      height: `${radius*2}px`,
      backgroundColor: colourPalette.icons,
      left: `${x}px`,
      top: `${y}px`,
    }}/>
}
