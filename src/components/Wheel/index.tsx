import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0);

const toWheel = (wheel): MotionArc[] => wheel ? wheel.arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: wheel.startRotation + sumAngles(allArcs) + allArcs.length
  }]
}, []) : [];

const center = {
  x: 350,
  y: 350
};

export namespace Wheel {
  export interface Props {
    wheel: {arcs: Arc[], startRotation: number},
    circle: any,
    animationPreset: string,
    onFocus: (id: string) => void,
    onFocusLost: (id: string) => void,
  }

  export interface State {
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  arcRefs = {};
  layer: {draw: () => void} = undefined;

  getDefaultStyles = () => {
    const self = this;
    return toWheel(this.props.wheel).map(arc => ({
      key: arc.fill,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: this.willEnter.bind(self)()
    }))
  }

  getStyles = () => {
    const preset = presets[this.props.animationPreset];
    return toWheel(this.props.wheel).map(arc => ({
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
        outerRadius: spring(circle.radius.outer)
      }
    }]
  }

  willCircleEnter() {
    return {
      opacity: 0,
      innerRadius: this.props.circle.radius.inner,
      outerRadius: this.props.circle.radius.inner
    }
  }

  render() {
    return (
      <Stage width={700} height={700}>
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
          <TransitionMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getStyles()}
            willEnter={this.willEnter.bind(this)}
          >
            {styles =>
              <Layer>
                {styles.map(({style, key, data: {active, image, fill, id, innerRadius}}) =>
                  <Group
                    key={key}
                  >
                    <Arc
                      opacity={style.opacity}
                      ref={arcRef => this.arcRefs[key] = arcRef}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={fill}
                      rotation={style.rotation}
                      onMouseOver={active ? this.props.onFocus.bind(undefined, id) : undefined}
                      onMouseOut={active ? this.props.onFocusLost.bind(undefined, id) : undefined}
                    />
                  </Group>
                )}
              </Layer>
            }
          </TransitionMotion>
          <TransitionMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getStyles()}
            willEnter={this.willEnter.bind(this)}
          >
            {styles =>
              <Layer>
                {styles.filter(({data: {image}}) => image).map(({style, key, data: {image, fill, innerRadius}}) =>
                  <Group
                    key={key}
                    x={center.x}
                    y={center.y}
                    offsetY={0.9 * (style.outerRadius - style.imageHeight / 2)}
                    rotation={90 + style.rotation + style.angle / 2}
                  >
                    <KonvaImage
                      image={image.image}
                      height={style.imageHeight}
                      width={style.imageWidth}
                      opacity={image.opacity || 1}
                      rotation={-(90 + style.rotation + style.angle / 2)}
                      offsetX={style.imageWidth / 2}
                      offsetY={style.imageHeight / 2}
                    />
                  </Group>
                )}
              </Layer>
            }
          </TransitionMotion>
      </Stage>
    );
  }
}
