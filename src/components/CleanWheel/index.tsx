import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {presets,StaggeredMotion, TransitionMotion, Motion, spring} from 'react-motion';
import * as style from '../../containers/PoC/style.css';

const center = {
  x: 370,
  y: 370
};

export namespace CleanWheel {
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
    touched: boolean,
  }
}

export class CleanWheel extends React.Component<CleanWheel.Props, CleanWheel.State> {
  state = {
    scale: 1,
    touched: false
  }

  componentDidMount () {
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
    const {circle, animationPreset} = this.props
    if (!circle) {
      return [];
    }

    return [{
      key: 'circle',
      data: {
        fill: circle.fill
      },
      style: {
        angle: spring(360, animationPreset),
        opacity: spring(circle.opacity, animationPreset),
        innerRadius: spring(circle.radius.inner, animationPreset),
        outerRadius: spring(circle.radius.outer, animationPreset)
      }
    }]
  }

  willCircleEnter() {
    return {
      opacity: 0,
      angle: 0,
      innerRadius: this.props.circle.radius.inner,
      outerRadius: this.props.circle.radius.inner,
    }
  }

  touched = (callback) => {
    this.setState({touched: true}, callback);
  }

  render() {
    const preset = this.props.animationPreset;
    return (
      <div id="stage-container" style={{position: 'relative', width: `${center.x*2*this.state.scale}px`, height: `${center.y*2*this.state.scale}px`}}>
        <div className={style.circleTextContainer}>
          <p>{this.props.centerText}</p>
        </div>
        <Stage scaleX={this.state.scale} scaleY={this.state.scale} width={center.x*2*this.state.scale} height={center.y*2*this.state.scale}>
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
                      angle={style.angle}
                      rotation={this.props.wheel[this.props.wheel.length - 2].rotation + this.props.wheel[this.props.wheel.length - 2].angle}
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
           <StaggeredMotion
              defaultStyles={this.props.wheel.map((_, i) => {
                const wheelPart = this.props.wheel[i];

                return {
                  opacity: wheelPart.opacity,
                  innerRadius: wheelPart.radius.inner,
                  outerRadius: wheelPart.radius.outer,
                  angle: wheelPart.angle,
                  rotation: -270,
                }
              })}
              styles={previousStyles => previousStyles.map((_, i) => {
                const {touched} = this.state;
                const wheelPart = this.props.wheel[i];

                if (touched) {
                  return {
                    opacity: spring(wheelPart.opacity), preset,
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
                  opacity: spring(wheelPart.opacity, preset),
                  innerRadius: wheelPart.radius.inner,
                  outerRadius: spring(wheelPart.radius.outer, preset),
                  angle: previousStyles[i - 1].angle,
                  rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle + 1,
                }
              })}
            >
              {styles =>
                <Layer>
                  {styles.map((style, i) => <Arc
                      opacity={style.opacity}
                      key={i}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      rotation={style.rotation}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={this.props.wheel[i].fill}
                      onMouseOver={this.touched.bind(undefined, this.props.onFocus.bind(undefined, this.props.wheel[i].id))}
                      onMouseOut={this.touched.bind(undefined, this.props.onFocusLost.bind(undefined, this.props.wheel[i].id))}
                      onClick={this.touched.bind(undefined, this.props.onSelect.bind(undefined, this.props.wheel[i].id))}
                  />)}
                </Layer>
              }
            </StaggeredMotion>
        </Stage>
      </div>
    );
  }
}