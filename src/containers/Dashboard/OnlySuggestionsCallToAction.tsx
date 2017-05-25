import * as React from 'react'
import {Text, Rect, Layer} from 'react-konva'

export default ({setCursor, colourPalette, wheelOrigin, activeRadius}) => {
  const width = 1.1 * activeRadius
  const height = 55

  const rect = {
    x: wheelOrigin.x - 0.5 * width,
    y: wheelOrigin.y - 0.5 * height,
    width,
    height,
  }

  return <Layer>
    <Rect
      fill={colourPalette.background}
      cornerRadius={0.5 * height}
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      {...rect}
    />
    <Text
      text='Versicherung hinzufügen'
      fill={colourPalette.font}
      fontSize={23}
      padding={15}
      align='center'
      listening={false}
      {...rect}
    />
  </Layer>
}
