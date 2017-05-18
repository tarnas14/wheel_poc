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
  }

  export interface State {
    scale: number,
    touched: boolean
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
                }
              })}
              styles={previousStyles => previousStyles.map((_, i) => {
                const {touched} = this.state
                const wheelPart = this.props.wheel[i]

                if (touched) {
                  return {
                    opacity: spring(wheelPart.opacity, preset),
                    innerRadius: wheelPart.radius.inner,
                    outerRadius: spring(wheelPart.radius.outer, preset),
                    angle: spring(wheelPart.angle, preset),
                    rotation: spring(wheelPart.rotation, preset),
                  }
                }

                return i === 0
                ? {
                  opacity: spring(wheelPart.opacity, preset),
                  innerRadius: wheelPart.radius.inner,
                  outerRadius: spring(wheelPart.radius.outer, preset),
                  angle: spring(wheelPart.angle, preset),
                  rotation: spring(wheelPart.rotation, preset),
                } : {
                  opacity: previousStyles[i - 1].opacity,
                  innerRadius: wheelPart.radius.inner,
                  outerRadius: spring(wheelPart.radius.outer, preset),
                  angle: spring(wheelPart.angle, preset),
                  rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 0.5 + wheelPart.padding,
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
                          key={i}
                          angle={style.angle}
                          x={center.x}
                          y={center.y}
                          rotation={style.rotation}
                          innerRadius={style.innerRadius}
                          outerRadius={style.outerRadius}
                          fill={this.props.wheel[i].fill}
                      />
                      {wheelPart.image && <Group
                        key={`image_${i}`}
                        x={center.x}
                        y={center.y}
                        offsetY={style.imageOffsetScale * (style.outerRadius - style.imageHeight / 2)}
                        rotation={90 + style.rotation + style.angle / 2}
                      >
                        <KonvaImage
                          image={wheelPart.image.image}
                          height={style.imageHeight}
                          width={style.imageWidth}
                          opacity={wheelPart.image.opacity || 1}
                          rotation={-(90 + style.rotation + style.angle / 2)}
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
