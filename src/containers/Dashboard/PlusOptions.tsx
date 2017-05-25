import * as React from 'react'
import {Group, Circle, Text, Rect, Layer, Line} from 'react-konva'

export default ({
  colourPalette,
  showStroke,
  wheelOrigin,
  activeRadius,
  cdRadius,
  setCursor,
  addExistingInsurance,
  lockNewInsurance,
  checkRequirements,
}) => {
  const upperRect = {
    x: wheelOrigin.x - (activeRadius/2),
    y: wheelOrigin.y - (activeRadius * Math.sqrt(3) / 2) + cdRadius.inner*0.7,
    width: activeRadius,
    height: (activeRadius*Math.sqrt(3)/2) - cdRadius.inner*2.2,
  }

  const bottomRect = {
    x:wheelOrigin.x - (activeRadius/2),
    y:wheelOrigin.y + cdRadius.inner*2.5,
    width:activeRadius,
    height:(activeRadius*Math.sqrt(3)/2) - cdRadius.inner*3,
  }

  const rightRect = {
    x: wheelOrigin.x + cdRadius.inner * 1.2,
    y: wheelOrigin.y - activeRadius / 6,
    height:activeRadius/3,
    width:(activeRadius*Math.sqrt(3)/2-cdRadius.inner/2),
  }

  return <Layer>
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...upperRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={addExistingInsurance}
      onTap={addExistingInsurance}
      fill='white'
      padding={20}
      fontSize={28}
      lineHeight={1.3}
      text='Bestehende Versicherung hinzufügen'
      align='center'
      {...upperRect}
    />
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...bottomRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={checkRequirements}
      onTap={checkRequirements}
      fill='white'
      padding={20}
      fontSize={28}
      lineHeight={1.3}
      text='Versicherungsbedarf ermitteln'
      align='center'
      {...bottomRect}
    />
    <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
      {...rightRect}
    />
    <Text
      onMouseOver={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('default')}
      onClick={lockNewInsurance}
      onTap={lockNewInsurance}
      fill='white'
      padding={20}
      fontSize={28}
      lineHeight={1.2}
      text='Neue abschließen'
      align='center'
      {...rightRect}
    />
    <Line stroke={colourPalette.activePlus_backButton} lineCap='round' strokeWidth={5} points={
      [wheelOrigin.x + cdRadius.inner + 10, wheelOrigin.y - cdRadius.inner - 10,
       wheelOrigin.x + cdRadius.outer/1.7, wheelOrigin.y - cdRadius.outer/1.7]
    }/>
    <Line stroke={colourPalette.activePlus_backButton} lineCap='round' strokeWidth={5} points={
      [wheelOrigin.x + cdRadius.inner + 10, wheelOrigin.y + cdRadius.inner + 10,
       wheelOrigin.x + cdRadius.outer/1.7, wheelOrigin.y + cdRadius.outer/1.7]
    }/>
  </Layer>
}
