import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {presets,StaggeredMotion, TransitionMotion, Motion, spring} from 'react-motion';
import * as style from '../../containers/PoC/style.css';

const center = {
  x: 370,
  y: 370
};

export namespace WheelSequence {
  export interface Props {
    wheel: MotionArc[],
    circle: any,
    animationPreset: AnimationPreset,
    onFocus: (id: string) => void,
    onFocusLost: (id: string) => void,
    onSelect: (id: string) => void,
    setText: (text: string) => void,
    centerText: string,
    animation: (preset: AnimationPreset) => (sth: any[]) => any[]
  }

  export interface State {
    scale: number,
    arcCounter: number,
    mounted: boolean
  }
}

export class WheelSequence extends React.Component<WheelSequence.Props, WheelSequence.State> {
  container: any = {};
  stageRef: any = {};
  arcRefs = {};
  layer: {draw: () => void} = undefined;
  state = {
    scale: 1,
    arcCounter: 0,
    mounted: false,
  }

  componentDidMount () {
    setTimeout(() => this.setState({mounted: true}), 500)
    const updateScale = () => {
      const innerWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);
      const containerWidth = innerWidth > 740 ? 740 : innerWidth;
      const scale = containerWidth / (center.x * 2);

      this.setState({scale});
    }

    updateScale();
    window.onresize = updateScale;
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

  arcAnimationFinished = () => {
    this.setState(s => ({
      arcCounter: s.arcCounter + 1
    }))
  }

  initialAnimationFinished = () => {
    return this.state.arcCounter + 1 >= this.props.wheel.length;
  }

  render() {
    const preset = this.props.animationPreset;
    const colors = ['rebeccapurple', 'red', 'blue', 'yellow', 'pink', 'purple', 'green', 'orange', 'grey'];
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
           {this.state.mounted && <StaggeredMotion
              defaultStyles={this.props.wheel.map(_ => ({rotation: -270, angle: 0, outerRadius: 90}))}
              styles={this.props.animation(preset)}
            >
              {styles =>
                <Layer>
                  {styles.map((style, i) => <Arc
                      key={i}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      rotation={style.rotation}
                      innerRadius={90}
                      outerRadius={style.outerRadius}
                      fill={colors[i]}
                  />)}
                </Layer>
              }
            </StaggeredMotion>
           }
        </Stage>
      </div>
    );
  }
}
