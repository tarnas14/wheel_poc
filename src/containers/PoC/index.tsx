import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import './style.css'

const startRotation = -70;

const centerWheel = {
  fill: '#95a5a6',
  radius: {
    inner: 60,
    outer: 70
  }
};

interface DonutRadius {
  inner: number,
  outer: number
}

interface Arc {
  angle: number,
  fill: string,
  radius: DonutRadius,
  id: string,
  opacity: number
}

interface MotionArc extends Arc {
  rotation: number
}

interface Wheel {
  initialRadius: DonutRadius,
  startRotation: number,
  arcs: Arc[]
}

const sameAngle = 35;

const middleRadius = {
    inner: centerWheel.radius.inner,
    outer: centerWheel.radius.outer + 120
}

const middleWheel = {
  initialRadius: middleRadius,
  startRotation: -120,
  arcs: [
    {
      id: '1',
      angle: sameAngle,
      fill: '#00fff0',
      opacity: 0.7,
      radius: middleRadius,
    },
    {
      id: '2',
      angle: 50,
      fill: '#00fff0',
      opacity: 1,
      radius: {
        ...middleRadius,
        outer: middleRadius.outer + 30
      },
    },
    {
      id: '3',
      angle: sameAngle,
      fill: '#00fff0',
      opacity: 0.7,
      radius: middleRadius,
    },
    {
      id: '4',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.4,
      radius: {
        inner: centerWheel.radius.inner,
        outer: centerWheel.radius.outer + 80
      }
    },
    {
      id: '5',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.6,
      radius: {
        inner: centerWheel.radius.inner,
        outer: centerWheel.radius.outer + 80
      }
    },
    {
      id: '6',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.5,
      radius: {
        inner: centerWheel.radius.inner,
        outer: centerWheel.radius.outer + 80
      }
    },
  ]
}

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0);

const toWheel = ({startRotation, arcs}): MotionArc[] => arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: startRotation + sumAngles(allArcs) + allArcs.length
  }]
}, []);

export namespace PoC {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    open: boolean,
    arcs: MotionArc[]
  }
}

const center = {
  x: 350,
  y: 350
};

export class PoC extends React.Component<PoC.Props, PoC.State> {
  arcRefs = {};
  layer: {draw: () => void} = undefined;

  constructor (props) {
    super(props);
    this.state = {
      open: false,
      arcs: toWheel(middleWheel)
    }
  }

  getDefaultStyles = () => {
    return this.state.arcs.map(arc => ({
      key: arc.fill,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: {
        angle: 0,
        rotation: 0,
        outerRadius: arc.radius.inner
      }
    }))
  }

  getStyles = () => {
    return this.state.arcs.map(arc => ({
      key: arc.id,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: {
        angle: spring(arc.angle, presets.wobbly),
        rotation: spring(arc.rotation, presets.wobbly),
        outerRadius: spring(arc.radius.outer, presets.wobbly)
      }
    }))
  }

  willEnter() {
    return {
      angle: 0,
      rotation: 0,
      outerRadius: middleWheel.initialRadius.outer
    }
  }

  render() {
    const {open} = this.state;
    return (
      <div>
        <Stage width={700} height={700}>
            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willEnter={this.willEnter}
            >
              {styles =>
                <Layer ref={layer => this.layer = layer}>
                  <Arc
                    opacity={0.5}
                    ref={arcRef => this.arcRefs['innerCircle'] = arcRef}
                    angle={360}
                    x={center.x}
                    y={center.y}
                    innerRadius={centerWheel.radius.inner}
                    outerRadius={centerWheel.radius.outer}
                    fill={centerWheel.fill}
                  />
                  {styles.map(({style, key, data: {opacity, rotation, fill, innerRadius}}) =>
                    <Arc
                      opacity={opacity}
                      ref={arcRef => this.arcRefs[key] = arcRef}
                      key={key}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={innerRadius}
                      outerRadius={style.outerRadius}
                      fill={fill}
                      rotation={style.rotation}
                    />
                  )}
                </Layer>
              }
            </TransitionMotion>
        </Stage>
      </div>
    );
  }
}
