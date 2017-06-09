import * as React from 'react'
import '../../types/models.ts'
import {Group, Circle, Text, Rect, Layer, Line} from 'react-konva'

interface Interaction {
    action: () => void,
    text: string
}

interface Props {
    colourPalette: any,
    showStroke: boolean,
    wheelOrigin: Coords,
    activeRadius: number,
    cdRadius: DonutRadius,
    setCursor: (cursor: string) => void,
    interactions: {
        upper: Interaction,
        bottom: Interaction,
        right: Interaction
    },
    addCtaText: string
}

export default ({
  colourPalette,
  showStroke,
  wheelOrigin,
  activeRadius,
  cdRadius,
  setCursor,
  interactions: {upper, bottom, right},
  addCtaText
}: Props) => {
  const upperRect = {
    x: wheelOrigin.x - (activeRadius * 0.4 ),
    y: wheelOrigin.y - (activeRadius * Math.sqrt(3) / 2) + cdRadius.inner * 0.7,
    width: activeRadius * 0.8,
    height: (activeRadius * Math.sqrt(3) / 2) - cdRadius.inner * 1.5
  }

  const bottomRect = {
    x: wheelOrigin.x - (activeRadius / 2),
    y: wheelOrigin.y + cdRadius.inner * 1.6,
    width: activeRadius,
    height: (activeRadius * Math.sqrt(3) / 2) - cdRadius.inner * 1.7
  }

  const rightRect = {
    x: wheelOrigin.x + cdRadius.inner * 0.65,
    y: wheelOrigin.y - activeRadius / 6,
    height: activeRadius * 0.5,
    width: (activeRadius * Math.sqrt(3) * 0.55)
  }

  const leftRect = {
    x: wheelOrigin.x - (activeRadius * Math.sqrt(3) * 0.55),
    y: wheelOrigin.y - 15,
    height: activeRadius * 0.5,
    width: (activeRadius * Math.sqrt(3) * 0.55) - cdRadius.inner
  }

  return <Layer>
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...upperRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={upper.action}
      onTap={upper.action}
      fill='white'
      padding={20}
      fontSize={26}
      lineHeight={1.3}
      text={upper.text}
      align='center'
      {...upperRect}
    />
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...bottomRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={bottom.action}
      onTap={bottom.action}
      fill='white'
      padding={20}
      fontSize={26}
      lineHeight={1.3}
      text={bottom.text}
      align='center'
      {...bottomRect}
    />
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...rightRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={right.action}
      onTap={right.action}
      fill='white'
      padding={20}
      fontSize={22}
      lineHeight={1.2}
      text={right.text}
      align='center'
      {...rightRect}
    />
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...leftRect}
    />
    <Text
      fill='white'
      fontSize={30}
      text={addCtaText}
      align='center'
      {...leftRect}
    />
    <Line stroke={colourPalette.icons} lineCap='round' strokeWidth={2} points={
      [wheelOrigin.x + cdRadius.inner + 5, wheelOrigin.y - cdRadius.inner - 5,
       wheelOrigin.x + cdRadius.outer * 0.65, wheelOrigin.y - cdRadius.outer * 0.65]
    }/>
    <Line stroke={colourPalette.icons} lineCap='round' strokeWidth={2} points={
      [wheelOrigin.x + cdRadius.inner + 5, wheelOrigin.y + cdRadius.inner + 5,
       wheelOrigin.x + cdRadius.outer * 0.65, wheelOrigin.y + cdRadius.outer * 0.65]
    }/>
  </Layer>
}
