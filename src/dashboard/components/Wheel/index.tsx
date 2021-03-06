import * as React from 'react'
import {Path, Text, Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {StaggeredMotion, spring} from 'react-motion'

import '../../types/models'

export namespace Wheel {
  export interface Props {
    disabled: boolean,
    wheel: MotionArc[],
    animationPreset: AnimationPreset,
    arcClick: (id: string, collapsed: boolean) => void,
    origin: {
      x: number,
      y: number
    },
    colourPalette: any,
    shadowSettings: ShadowSettings
  }

  export interface State {
    touched: boolean
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  state = {
    touched: false
  }

  touched = (callback: () => void) => this.setState({touched: true}, callback)

  render() {
    const {animationPreset: preset, origin, disabled, shadowSettings} = this.props

    return (
       <StaggeredMotion
          defaultStyles={this.props.wheel.map((_, i) => {
            const wheelPart = this.props.wheel[i]

            return {
              opacity: 0,
              innerRadius: wheelPart.radius.inner,
              outerRadius: wheelPart.radius.outer,
              angle: wheelPart.angle,
              rotation: -270,
              imageWidth: 0,
              imageHeight: 0,
              imageOffsetScale: 0,
              imageRotation: 0,
              imageScaleX: 0.01,
              imageScaleY: 0.01
            }
          })}
          styles={previousStyles => previousStyles.map((_, i) => {
            const {touched} = this.state
            const wheelPart = this.props.wheel[i]

            if (touched) {
              return {
                opacity: spring(wheelPart.opacity, preset),
                innerRadius: spring(wheelPart.radius.inner, preset),
                outerRadius: spring(wheelPart.radius.outer, preset),
                angle: spring(wheelPart.angle, preset),
                rotation: spring(wheelPart.rotation, preset),
                imageWidth: wheelPart.svg ? spring(wheelPart.svg.size.width) : 0,
                imageHeight: wheelPart.svg ? spring(wheelPart.svg.size.height) : 0,
                imageOffsetScale: wheelPart.svg ? spring(wheelPart.svg.offsetScale) : 0,
                imageRotation: wheelPart.svg ? spring(wheelPart.svg.rotation(wheelPart.rotation, wheelPart.angle)) : 0,
                imageScaleX: wheelPart.svg ? spring(wheelPart.svg.scale.x) : 0.01,
                imageScaleY: wheelPart.svg ? spring(wheelPart.svg.scale.y) : 0.01
              }
            }

            return i === 0
            ? {
              opacity: spring(wheelPart.opacity, preset),
              innerRadius: spring(wheelPart.radius.inner, preset),
              outerRadius: spring(wheelPart.radius.outer, preset),
              angle: spring(wheelPart.angle, preset),
              rotation: spring(wheelPart.rotation, preset),
              imageWidth: wheelPart.svg ? spring(wheelPart.svg.size.width) : 0,
              imageHeight: wheelPart.svg ? spring(wheelPart.svg.size.height) : 0,
              imageOffsetScale: wheelPart.svg ? spring(wheelPart.svg.offsetScale) : 0,
              imageRotation: wheelPart.svg ? spring(wheelPart.svg.rotation(wheelPart.rotation, wheelPart.angle)) : 0,
              imageScaleX: wheelPart.svg ? spring(wheelPart.svg.scale.x) : 0.01,
              imageScaleY: wheelPart.svg ? spring(wheelPart.svg.scale.y) : 0.01
            } : {
              opacity: spring(wheelPart.opacity, preset),
              innerRadius: wheelPart.radius.inner,
              outerRadius: spring(wheelPart.radius.outer, preset),
              angle: spring(wheelPart.angle, preset),
              rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding,
              imageWidth: wheelPart.svg ? spring(wheelPart.svg.size.width) : 0,
              imageHeight: wheelPart.svg ? spring(wheelPart.svg.size.height) : 0,
              imageOffsetScale: wheelPart.svg ? spring(wheelPart.svg.offsetScale) : 0,
              imageRotation: wheelPart.svg
                ? wheelPart.svg.rotation(previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding, wheelPart.angle)
                : 0,
              imageScaleX: wheelPart.svg ? spring(wheelPart.svg.scale.x) : 0.01,
              imageScaleY: wheelPart.svg ? spring(wheelPart.svg.scale.y) : 0.01
            }
          })}
        >
          {(styles: any[]) =>
            <Layer
              listening={!disabled}
              opacity={disabled ? 0.7 : 1}
            >
              {styles.map((style, i) => {
                const wheelPart = this.props.wheel[i]
                const shadowEnabled = wheelPart.id !== 'plus' && shadowSettings.arc.disableWhenSelected
                    ? shadowSettings.arc.enabled && style.angle < 200
                    : shadowSettings.arc.enabled

                return <Group key={wheelPart.id}>
                  <Arc
                      opacity={style.opacity}
                      key={wheelPart.id}
                      angle={style.angle}
                      x={origin.x}
                      y={origin.y}
                      rotation={style.rotation}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={this.props.wheel[i].fill}
                      onMouseOver={this.touched.bind(undefined, () => {})}
                      onClick={this.touched.bind(undefined, this.props.arcClick.bind(undefined, wheelPart.id, wheelPart.collapsed))}
                      onTap={this.touched.bind(undefined, this.props.arcClick.bind(undefined, wheelPart.id, wheelPart.collapsed))}
                      shadowBlur={shadowSettings.arc.blur}
                      shadowOpacity={shadowSettings.arc.opacity}
                      shadowOffset={shadowSettings.arc.offset}
                      shadowEnabled={shadowEnabled}
                  />
                  {wheelPart.raised && <Arc
                      opacity={style.opacity}
                      key={`indicator_${wheelPart.id}`}
                      angle={style.angle}
                      x={origin.x}
                      y={origin.y}
                      rotation={style.rotation}
                      innerRadius={style.innerRadius - 3}
                      outerRadius={style.innerRadius}
                      fill={this.props.colourPalette.schaboHighlight}
                  />}
                  {wheelPart.svg && <Group
                    key={`image_${wheelPart.id}`}
                    x={origin.x}
                    y={origin.y}
                    offsetY={style.imageOffsetScale * (style.outerRadius - style.imageHeight / 2 - wheelPart.svg.offsetFromOutside)}
                    rotation={style.imageRotation}
                    listening={false}
                  >
                    <Path
                      opacity={wheelPart.svg.opacity}
                      data={wheelPart.svg.path}
                      fill={wheelPart.svg.fill}
                      scale={{x: style.imageScaleX, y: style.imageScaleY}}
                      rotation={-style.imageRotation}
                      offsetX={style.imageWidth / style.imageScaleX / 2}
                      offsetY={style.imageHeight / style.imageScaleY / 2}
                    />
                  </Group>}
                </Group>
              })}
            </Layer>
          }
        </StaggeredMotion>
    )
  }
}
