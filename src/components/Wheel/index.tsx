import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring} from 'react-motion';
import * as style from '../../containers/PoC/style.css';

const center = {
  x: 370,
  y: 370
};

export namespace Wheel {
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
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  container: any = {};
  stageRef: any = {};
  arcRefs = {};
  layer: {draw: () => void} = undefined;
  state = {
    scale: 1
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

  getDefaultStyles = () => {
    const self = this;
    return this.props.wheel.map(arc => ({
      key: arc.fill,
      data: {
        ...arc,
        innerRadius: arc.radius.inner
      },
      style: this.willEnter.bind(self)()
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
            {/* actual arcs */}
            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willEnter={this.willEnter.bind(this)}
            >
              {styles =>
                <Layer>
                  {styles.map(({style, key, data: {children, active, focused, selected, image, fill, id, innerRadius}}) =>
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
                        onMouseOver={this.props.onFocus.bind(undefined, id)}
                        onMouseOut={this.props.onFocusLost.bind(undefined, id)}
                        onTouchEnd={this.props.onSelect.bind(undefined, id, selected)}
                        onClick={this.props.onSelect.bind(undefined, id, selected)}
                      />
                      {children && children.map(child => ({...child, width: 315 * 0.10})).map((child, childIndex) => {
                        const preset = this.props.animationPreset;
                        const rotationStyle = childIndex => style.rotation + (style.angle / children.length + (childIndex === 0 ? 0 : 0.5)) * childIndex
                        return <Motion
                           key={child.id}
                           style={{
                             angle: style.angle / children.length - 0.5,
                             innerRadius: style.outerRadius,
                             outerRadius: spring(style.outerRadius + (selected ? child.width : 10), preset),
                             rotation: rotationStyle(childIndex)
                           }}
                          >
                          {interpolatedStyles =>
                            <Arc
                              opacity={0.9 * style.opacity}
                              angle={interpolatedStyles.angle}
                              x={center.x}
                              y={center.y}
                              innerRadius={interpolatedStyles.innerRadius}
                              outerRadius={interpolatedStyles.outerRadius}
                              fill={child.fill}
                              rotation={interpolatedStyles.rotation}
                            />
                          }
                        </Motion>}
                      )}
                    </Group>
                  )}
                </Layer>
              }
            </TransitionMotion>

            {/* images */}
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
                      offsetY={style.imageOffsetScale * (style.outerRadius - style.imageHeight / 2)}
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
                        listening={false}
                      />
                    </Group>
                  )}
                </Layer>
              }
            </TransitionMotion>
        </Stage>
      </div>
    );
  }
}
