import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';

const startRotation = -70;

const centerWheel = {
  radius: {
    inner: 60,
    outer: 80
  },
  startRotation,
  arcs: [
    {
      angle: 90,
      fill: 'green',
    },
    {
      angle: 90,
      fill: 'red'
    },
    {
      angle: 90,
      fill: 'yellow'
    },
    {
      angle: 90,
      fill: 'blue'
    }
  ]
};

interface DonutRadius {
  inner: number,
  outer: number
}

interface Arc {
  angle: number,
  fill: string,
  radius: DonutRadius
}

interface MotionArc extends Arc {
  rotation: number
}

interface Wheel {
  initialRadius: DonutRadius,
  startRotation: number,
  arcs: Arc[]
}

const middleWheel = {
  initialRadius: {
    inner: centerWheel.radius.outer,
    outer: centerWheel.radius.outer + 110
  },
  startRotation: -130,
  arcs: [
    {
      angle: 30,
      fill: 'green'
    },
    {
      angle: 30,
      fill: 'blue'
    },
    {
      angle: 30,
      fill: 'yellow'
    },
    {
      angle: 30,
      fill: 'pink'
    }
  ].map(arc => ({...arc, radius: {
    inner: centerWheel.radius.outer,
    outer: centerWheel.radius.outer + 110
  }}))
}

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0);

const toWheel = ({startRotation, arcs}): MotionArc[] => arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: startRotation + sumAngles(allArcs)
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
      key: arc.fill,
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

  mouseOverArc(key) {
    this.setState(s => ({
      arcs: s.arcs.map(a => a.fill === key
        ? {
          ...a,
          radius: {
            ...a.radius,
            outer: a.radius.outer + 20
          }
        }
        : a
      )
    }));
  }

  mouseLeavesArc(key) {
    this.setState(s => ({
      arcs: s.arcs.map(a => a.fill === key
        ? {
          ...a,
          radius: {
            ...a.radius,
            outer: a.radius.outer - 20
          }
        }
        : a
      )
    }));
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
                  {styles.map(({style, key, data: {rotation, fill, innerRadius}}) =>
                    <Arc
                      ref={arcRef => this.arcRefs[key] = arcRef}
                      key={key}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={innerRadius}
                      outerRadius={style.outerRadius}
                      fill={fill}
                      rotation={style.rotation}
                      onMouseOver={this.mouseOverArc.bind(this, key)}
                      onMouseLeave={this.mouseLeavesArc.bind(this, key)}
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
