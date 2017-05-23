import * as React from 'react'
import {Group, Circle, Text, Rect, Layer, Line} from 'react-konva'

const Divider = ({stroke, points, strokeWidth = 5}) => <Line
  stroke={stroke}
  points={points}
  strokeWidth={strokeWidth}
  lineCap='round'
/>

interface Props {
  suggestion: BusinessArc,
  setCursor: (t: string) => void,
  wheelOrigin: {x: number, y: number},
  colourPalette: any,
  cdRadius: DonutRadius,
  activeRadius: DonutRadius,
  addExisting: (id: string) => void,
  lockNew: (id: string) => void,
}

export default ({
  suggestion,
  setCursor,
  colourPalette,
  wheelOrigin,
  cdRadius,
  activeRadius,
  addExisting,
  lockNew,
}: Props) => {
  if (!Boolean(suggestion)) {
    return <Layer listening={false}/>
  }

  const leftRect = {
    x: cdRadius.inner * 1.5,
    y: wheelOrigin.y - activeRadius.outer*0.05,
    height:activeRadius.outer * 0.29,
    width:(activeRadius.outer*Math.sqrt(3)*0.5-cdRadius.inner*2),
  }

  const bottomRect = {
    x: wheelOrigin.x - (activeRadius.outer*0.3),
    y: wheelOrigin.y + cdRadius.inner*3,
    width: activeRadius.outer*0.6,
    height: activeRadius.outer * 0.29,
  }

  const rightRect = {

  }

  return <Layer>
    <Rect
      fill={colourPalette.action.background}
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={() => addExisting(suggestion.id)}
      onTap={() => addExisting(suggestion.id)}
      cornerRadius={15}
      {...leftRect}
    />
    <Text
      listening={false}
      text='Bestehende hinzufügen'
      fill={colourPalette.action.font}
      lineHeight={1.3}
      padding={10}
      fontSize={28}
      {...leftRect}
    />

    <Rect
      fill={colourPalette.action.background}
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={() => lockNew(suggestion.id)}
      onTap={() => lockNew(suggestion.id)}
      cornerRadius={15}
      {...bottomRect}
    />
    <Text
      listening={false}
      text='Neue abschließen'
      fill={colourPalette.action.font}
      lineHeight={1.3}
      padding={10}
      fontSize={28}
      {...bottomRect}
    />

    <Divider
      stroke={colourPalette.divider}
      strokeWidth={4}
      points={[
        wheelOrigin.x - cdRadius.inner - 10, wheelOrigin.y + cdRadius.inner + 10,
        wheelOrigin.x - cdRadius.outer/1.7, wheelOrigin.y + cdRadius.outer/1.7
      ]}
    />
    {/*<Divider
      stroke={colourPalette.divider}
      strokeWidth={4}
      points={[
        wheelOrigin.x + cdRadius.inner + 10, wheelOrigin.y + cdRadius.inner + 10,
       wheelOrigin.x + cdRadius.outer/1.7, wheelOrigin.y + cdRadius.outer/1.7
      ]}/>*/}
  </Layer>
}
