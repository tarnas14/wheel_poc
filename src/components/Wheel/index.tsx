import * as React from 'react'
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {StaggeredMotion, spring} from 'react-motion'
import * as style from '../../containers/Dashboard/style.css'

const center = {
  x: 360,
  y: 360
}

export namespace Wheel {
  export interface Props {
    wheel: MotionArc[],
    animationPreset: AnimationPreset,
    centerText: string,
    arcClick: (id: string) => void,
  }

  export interface State {
    scale: number,
    touched: boolean,
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  state = {
    touched: false,
    scale: 1,
  }

  componentDidMount () {
    const updateScale = () => {
      const innerWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width)
      const containerWidth = innerWidth > center.x * 2 ? center.x * 2 : innerWidth
      const widthScale = containerWidth / (center.x * 2)

      const innerHeight = (screen.height)
      const containerHeight = innerHeight > center.y * 2 ? center.y * 2 : innerHeight
      const heightScale = containerHeight / (center.y * 2)

      const scale = Math.min(widthScale, heightScale)

      this.setState({scale})
    }

    updateScale()
    window.onresize = updateScale
  }

  touched = f => {
    this.setState({touched: true}, f)
  }

  render() {
    const preset = this.props.animationPreset
    return (
      <div id="stage-container" className={style.stageContainer} style={{position: 'relative', width: `${center.x*2*this.state.scale}px`, height: `${center.y*2*this.state.scale}px`}}>
        <div className={style.circleTextContainer}>
          <p>{this.props.centerText}</p>
        </div>
        <Stage scaleX={this.state.scale} scaleY={this.state.scale} width={center.x*2*this.state.scale} height={center.y*2*this.state.scale}>
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
                    imageWidth: wheelPart.image ? spring(wheelPart.image.size.width) : 0,
                    imageHeight: wheelPart.image ? spring(wheelPart.image.size.height) : 0,
                    imageOffsetScale: wheelPart.image ? spring(wheelPart.image.offsetScale) : 0,
                    imageRotation: wheelPart.image ? spring(wheelPart.image.rotation(wheelPart.rotation, wheelPart.angle)) : 0,
                  }
                }

                return i === 0
                ? {
                  opacity: spring(wheelPart.opacity, preset),
                  innerRadius: spring(wheelPart.radius.inner, preset),
                  outerRadius: spring(wheelPart.radius.outer, preset),
                  angle: spring(wheelPart.angle, preset),
                  rotation: spring(wheelPart.rotation, preset),
                  imageWidth: wheelPart.image ? spring(wheelPart.image.size.width) : 0,
                  imageHeight: wheelPart.image ? spring(wheelPart.image.size.height) : 0,
                  imageOffsetScale: wheelPart.image ? spring(wheelPart.image.offsetScale) : 0,
                  imageRotation: wheelPart.image ? spring(wheelPart.image.rotation(wheelPart.rotation, wheelPart.angle)) : 0,
                } : {
                  opacity: previousStyles[i - 1].opacity,
                  innerRadius: wheelPart.radius.inner,
                  outerRadius: spring(wheelPart.radius.outer, preset),
                  angle: spring(wheelPart.angle, preset),
                  rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding,
                  imageWidth: wheelPart.image ? spring(wheelPart.image.size.width) : 0,
                  imageHeight: wheelPart.image ? spring(wheelPart.image.size.height) : 0,
                  imageOffsetScale: wheelPart.image ? spring(wheelPart.image.offsetScale) : 0,
                  imageRotation: wheelPart.image ? wheelPart.image.rotation(previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding, wheelPart.angle) : 0,
                }
              })}
            >
              {styles =>
                <Layer>
                  {styles.map((style, i) => {
                    const wheelPart = this.props.wheel[i]
                    return <Group key={wheelPart.id}>
                      <Arc
                          opacity={style.opacity}
                          key={wheelPart.id}
                          angle={style.angle}
                          x={center.x}
                          y={center.y}
                          rotation={style.rotation}
                          innerRadius={style.innerRadius}
                          outerRadius={style.outerRadius}
                          fill={this.props.wheel[i].fill}

                          onMouseOver={this.touched.bind(undefined, () => {})}
                          onClick={this.touched.bind(undefined, this.props.arcClick.bind(undefined, wheelPart.id))}
                      />
                      {wheelPart.raised && <Arc
                          opacity={style.opacity}
                          key={`indicator_${wheelPart.id}`}
                          angle={style.angle}
                          x={center.x}
                          y={center.y}
                          rotation={style.rotation}
                          innerRadius={style.innerRadius - 3}
                          outerRadius={style.innerRadius}
                          fill='white'
                      />}
                      {wheelPart.image && <Group
                        key={`image_${wheelPart.id}`}
                        x={center.x}
                        y={center.y}
                        offsetY={style.imageOffsetScale * (style.outerRadius - style.imageHeight / 2)}
                        rotation={style.imageRotation}
                      >
                        <KonvaImage
                          image={wheelPart.image.image}
                          height={style.imageHeight}
                          width={style.imageWidth}
                          opacity={wheelPart.image.opacity || 1}
                          rotation={-style.imageRotation}
                          offsetX={style.imageWidth / 2}
                          offsetY={style.imageHeight / 2}
                          listening={false}
                        />
                      </Group>}
                    </Group>
                  })}
                </Layer>
              }
            </StaggeredMotion>
        </Stage>
      </div>
    )
  }
}
