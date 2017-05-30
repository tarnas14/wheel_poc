import * as React from 'react'
import {Path, Text, Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {StaggeredMotion, spring} from 'react-motion'

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
  }

  export interface State {
    touched: boolean,
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  state = {
    touched: false,
  }

  touched = f => {
    this.setState({touched: true}, f)
  }

  render() {
    const {animationPreset: preset, origin, disabled} = this.props
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
              imageFontSize: 0,
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
                imageFontSize: wheelPart.svg ? spring(wheelPart.svg.textFontSize) : 0,
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
              imageFontSize: 0,
            } : {
              opacity: spring(wheelPart.opacity, preset),
              innerRadius: wheelPart.radius.inner,
              outerRadius: spring(wheelPart.radius.outer, preset),
              angle: spring(wheelPart.angle, preset),
              rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding,
              imageWidth: wheelPart.svg ? spring(wheelPart.svg.size.width) : 0,
              imageHeight: wheelPart.svg ? spring(wheelPart.svg.size.height) : 0,
              imageOffsetScale: wheelPart.svg ? spring(wheelPart.svg.offsetScale) : 0,
              imageRotation: wheelPart.svg ? wheelPart.svg.rotation(previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding, wheelPart.angle) : 0,
              imageFontSize: 0,
            }
          })}
        >
          {styles =>
            <Layer
              listening={!disabled}
              opacity={disabled ? 0.7 : 1}
            >
              {styles.map((style, i) => {
                const wheelPart = this.props.wheel[i]
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
                      scale={wheelPart.svg.scale}
                      rotation={-style.imageRotation}
                      offsetX={style.imageWidth / wheelPart.svg.scale.x / 2}
                      offsetY={style.imageHeight / wheelPart.svg.scale.y / 2}
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
