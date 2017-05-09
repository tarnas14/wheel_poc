import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring} from 'react-motion';
import * as style from '../../containers/PoC/style.css';

const center = {
  x: 370,
  y: 370
};

export namespace Wheel3 {
  export interface Props {
    wheel: MotionArc[],
    circle: any,
    animationPreset: AnimationPreset,
    onFocus: (id: string) => void,
    onFocusLost: (id: string) => void,
    onSelect: (id: string) => void,
    setText: (text: string) => void,
    centerText: string,
  }

  export interface State {
    scale: number,
    arcCounter: number,
    mounted: boolean,
  }
}

export class Wheel3 extends React.Component<Wheel3.Props, Wheel3.State> {
  container: any = {};
  stageRef: any = {};
  arcRefs = {};
  layer: {draw: () => void} = undefined;
  state = {
    scale: 1,
    arcCounter: 0,
    mounted: false
  }

  componentDidMount () {
    this.setState({mounted: true});
    const updateScale = () => {
      const innerWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
      const containerWidth = innerWidth > 740 ? 740 : innerWidth;
      const scale = containerWidth / (center.x * 2);

      this.setState({scale});
    }

    updateScale();
    window.onresize = updateScale;
  }

  getDefaultStyles = () => {
    const self = this;
    return this.props.wheel.map(arc => ({
      key: arc.fill,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: {
        opacity: 0,
        angle: arc.angle,
        rotation: arc.rotation,
        innerRadius: 0,
        outerRadius: 0,
        imageOffsetScale: 0,
        imageHeight: 0,
        imageWidth: 0
      }
    }))
  }

  getStyles = () => {
    const preset = this.props.animationPreset;
    return this.props.wheel.map(arc => ({
      key: arc.id,
      data: {
        ...arc
      },
      style: {
        opacity: spring(arc.opacity),
        angle: spring(arc.angle, preset),
        rotation: spring(arc.rotation, preset),
        innerRadius: spring(arc.radius.inner, preset),
        outerRadius: spring(arc.radius.outer, preset),
        imageOffsetScale: arc.image
          ? spring (arc.image.offsetScale)
          : 0,
        imageHeight: arc.image
          ? spring(arc.image.size.height)
          : 0,
        imageWidth: arc.image
          ? spring(arc.image.size.width)
          : 0
      }
    }))
  }

  willEnter() {
    const {circle} = this.props;
    return {
      angle: 0,
      rotation: 0,
      opacity: 0,
      innerRadius: circle.radius.inner,
      outerRadius: circle.radius.inner,
      imageOffsetScale: 0,
      imageHeight: 0,
      imageWidth: 0,
    }
  }

  getDefaultCircleStyles = () => {
    const {circle} = this.props
    if (!circle) {
      return [];
    }

    return [{
      key: 'circle',
      data: {
        fill: circle.fill
      },
      style: this.willCircleEnter.bind(this)()
    }]
  }

  getCircleStyles = () => {
    const {circle} = this.props
    if (!circle) {
      return [];
    }

    return [{
      key: 'circle',
      data: {
        fill: circle.fill
      },
      style: {
        opacity: spring(circle.opacity),
        innerRadius: spring(circle.radius.inner),
        outerRadius: spring(circle.radius.outer),
        angle: spring(360)
      }
    }]
  }

  willCircleEnter() {
    return {
      opacity: 0,
      innerRadius: this.props.circle.radius.inner,
      outerRadius: this.props.circle.radius.inner,
      angle: 0
    }
  }

  arcAnimationFinished = () => {
    this.setState(s => ({
      arcCounter: s.arcCounter + 1
    }))
  }

  initialAnimationFinished = () => {
    return this.state.arcCounter + 1 >= this.props.wheel.length;
  }

  render() {
    return (
      <div id="stage-container" style={{position: 'relative', width: `${center.x*2*this.state.scale}px`, height: `${center.y*2*this.state.scale}px`}}>
        <div className={style.circleTextContainer}>
          <p>{this.props.centerText}</p>
        </div>
        <Stage ref={stageRef => this.stageRef = stageRef} scaleX={this.state.scale} scaleY={this.state.scale} width={center.x*2*this.state.scale} height={center.y*2*this.state.scale}>
            {/* circle */}
            <TransitionMotion
              defaultStyles={this.getDefaultCircleStyles()}
              styles={this.getCircleStyles()}
              willEnter={this.willCircleEnter.bind(this)}
            >
              {styles =>
                <Layer>
                  {styles.map(({style, key, data: {fill}}) =>
                    <Arc
                      opacity={style.opacity}
                      key={key}
                      ref={arcRef => this.arcRefs['innerCircle'] = arcRef}
                      angle={360}
                      x={center.x}
                      y={center.y}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={fill}
                    />
                  )}
                </Layer>
              }
            </TransitionMotion>
            <Layer>
              {this.props.wheel.map(arc => <Motion
                key={arc.id}
                onRest={this.arcAnimationFinished.bind(this)}
                style={{
                  opacity: this.state.mounted ? spring(arc.opacity) : 0,
                  angle: this.state.mounted ? spring(arc.angle) : arc.angle,
                  rotation: this.state.mounted ? spring(arc.rotation) : arc.rotation,
                  innerRadius: arc.radius.inner,
                  outerRadius: this.state.mounted ? spring(arc.radius.outer) : arc.radius.outer
                }}
              >
                {interpolatedStyle => <Group>
                  <Arc
                    opacity={interpolatedStyle.opacity}
                    angle={interpolatedStyle.angle}
                    rotation={interpolatedStyle.rotation}
                    x={center.x}
                    y={center.y}
                    innerRadius={interpolatedStyle.innerRadius}
                    outerRadius={interpolatedStyle.outerRadius}
                    fill={arc.fill}
                    onMouseOver={this.props.onFocus.bind(undefined, arc.id)}
                    onMouseOut={this.props.onFocusLost.bind(undefined, arc.id)}
                    onTouchEnd={this.props.onSelect.bind(undefined, arc.id, arc.selected)}
                    onClick={this.props.onSelect.bind(undefined, arc.id, arc.selected)}
                  />
                  {arc.image &&
                    <Motion
                      style={{
                        imageHeight: spring(arc.image.size.height),
                        imageWidth: spring(arc.image.size.width)
                      }}
                    >
                      {imageStyle =>
                        <Group
                          x={center.x}
                          y={center.y}
                          offsetY={arc.image.offsetScale * (interpolatedStyle.outerRadius - imageStyle.imageHeight / 2)}
                          rotation={90 + interpolatedStyle.rotation + interpolatedStyle.angle / 2}
                        >
                          <KonvaImage
                            image={arc.image.image}
                            height={imageStyle.imageHeight}
                            width={imageStyle.imageWidth}
                            opacity={arc.image.opacity || 1}
                            rotation={-(90 + arc.rotation + interpolatedStyle.angle / 2)}
                            offsetX={imageStyle.imageWidth / 2}
                            offsetY={imageStyle.imageHeight / 2}
                            listening={false}
                          />
                        </Group>
                      }
                    </Motion>
                  }
                </Group>}
              </Motion>)}
            </Layer>
        </Stage>
      </div>
    );
  }
}
