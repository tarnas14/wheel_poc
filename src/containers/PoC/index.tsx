import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import './style.css'

const startRotation = -70;

const centerWheel = {
  opacity: 0.5,
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
    arcs: MotionArc[],
    circle: any,
    animationPreset: string
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
      arcs: toWheel(middleWheel),
      circle: centerWheel,
      animationPreset: 'wobbly'
    }
  }

  getDefaultStyles = () => {
    return this.state.arcs.map(arc => ({
      key: arc.fill,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: this.willEnter()
    }))
  }

  getStyles = () => {
    const preset = presets[this.state.animationPreset];
    return this.state.arcs.map(arc => ({
      key: arc.id,
      data: {
        ...arc
      },
      style: {
        opacity: spring(arc.opacity),
        angle: spring(arc.angle, preset),
        rotation: spring(arc.rotation, preset),
        innerRadius: spring(arc.radius.inner, preset),
        outerRadius: spring(arc.radius.outer, preset)
      }
    }))
  }

  willEnter() {
    return {
      angle: 0,
      rotation: 0,
      opacity: 0,
      innerRadius: 0,
      outerRadius: 0
    }
  }

  getDefaultCircleStyles = () => {
    const {circle} = this.state
    if (!circle) {
      return [];
    }

    return [{
      key: 'circle',
      data: {
        fill: circle.fill
      },
      style: this.willCircleEnter()
    }]
  }

  getCircleStyles = () => {
    const {circle} = this.state
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
      innerRadius: 0,
      outerRadius: 0
    }
  }

  removeData = () => {
    this.setState({
      arcs: [],
      circle: undefined
    });
  }

  addDataAgain = () => {
    this.setState({
      arcs: toWheel(middleWheel),
      circle: centerWheel
    })
  }

  setPreset = (e) => {
    const preset = e.currentTarget.value;
    this.setState({
      animationPreset: preset
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.removeData.bind(this)}>hide</button>
        <button onClick={this.addDataAgain.bind(this)}>show</button>
        <select onChange={this.setPreset.bind(this)} value={this.state.animationPreset}>
          <option value="noWobble">noWobble</option>
          <option value="wobbly">wobbly</option>
          <option value="gentle">gentle</option>
          <option value="stiff">stiff</option>
        </select>
        <Stage width={700} height={700}>
            <TransitionMotion
              defaultStyles={this.getDefaultCircleStyles()}
              styles={this.getCircleStyles()}
              willEnter={this.willCircleEnter}
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
              willEnter={this.willEnter}
            >
              {styles =>
                <Layer ref={layer => this.layer = layer}>
                  {styles.map(({style, key, data: {rotation, fill, innerRadius}}) =>
                    <Arc
                      opacity={style.opacity}
                      ref={arcRef => this.arcRefs[key] = arcRef}
                      key={key}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={style.innerRadius}
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
