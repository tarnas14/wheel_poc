import * as React from 'react';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';

const center = {
  x: 350,
  y: 350
};

export namespace Wheel {
  export interface Props {
    wheel: MotionArc[],
    circle: any,
    animationPreset: string,
    onFocus: (id: string) => void,
    onFocusLost: (id: string) => void,
    onSelect: (id: string) => void,
  }

  export interface State {
  }
}

export class Wheel extends React.Component<Wheel.Props, Wheel.State> {
  arcRefs = {};
  layer: {draw: () => void} = undefined;

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
    const preset = presets[this.props.animationPreset];
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

  getChildrenDefaultStyles = () => {
    const selectedArc = this.props.wheel.find(a => Boolean(a.selected && a.children && a.children.length));

    if (!selectedArc) {
      return []
    }

    return selectedArc.children.map(child => ({
      key: child.id,
      data: child,
      style: {
        angle: child.angle,
        rotation: child.rotation,
        innerRadius: child.radius.inner,
        outerRadius: child.radius.inner,
      }
    }))
  }

  getChildrenStyles = () => {
    const selectedArc = this.props.wheel.find(a => Boolean(a.selected && a.children && a.children.length));

    if (!selectedArc) {
      return []
    }

    return selectedArc.children.map(child => ({
      key: child.id,
      data: child,
      style: {
        outerRadius: spring(child.radius.outer),
        angle: child.angle,
        rotation: child.rotation,
        innerRadius: child.radius.inner
      }
    }))
  }

  childrenWillEnter(entering) {
    return {
      angle: entering.data.angle,
      rotation: entering.data.rotation,
      innerRadius: entering.data.radius.inner,
      outerRadius: entering.data.radius.inner,
    }
  }

  childrenWillLeave(leaving) {
    const outerTarget = (leaving.data.radius.outer - leaving.data.radius.inner + leaving.data.leavingRadiusTarget);
    // hardcoded QQ
    const parentRotation = -90.25

    return {
      outerRadius: spring(leaving.data.leavingRadiusTarget),
      angle: spring(0),
      rotation: spring(parentRotation),
      innerRadius: spring(leaving.data.leavingRadiusTarget, presets.wobbly)
    };
  }

  getSexyChildrenDefaultStyles = () => {
    const selectedArc = this.props.wheel.find(a => Boolean(a.selected && a.sexyChildren));

    if (!selectedArc) {
      return []
    }

    const startAngle = (selectedArc.sexyChildren.startAngle - 1) / selectedArc.sexyChildren.arcs.length;

    return selectedArc.sexyChildren.arcs.map((fill, i) => ({
      key: `test_${fill}`,
      data: {fill, radius: selectedArc.sexyChildren.radius, leaveTo: selectedArc.sexyChildren.leavingRadiusTarget},
      style: {
        opacity: 1,
        angle: startAngle,
        rotation: selectedArc.sexyChildren.startRotation + startAngle * i + i/2,
        innerRadius: selectedArc.sexyChildren.radius.inner,
        outerRadius: selectedArc.sexyChildren.radius.outer,
      }
    }))
  }

  getSexyChildrenStyles = () => {
    const preset = presets[this.props.animationPreset];
    const selectedArc = this.props.wheel.find(a => Boolean(a.selected && a.sexyChildren));

    if (!selectedArc) {
      return []
    }

    const endAngle = (selectedArc.angle - 1) / selectedArc.sexyChildren.arcs.length;

    return selectedArc.sexyChildren.arcs.map((fill, i) => ({
      key: `test_${fill}`,
      data: {fill, radius: selectedArc.sexyChildren.radius, leaveTo: selectedArc.sexyChildren.leavingRadiusTarget},
      style: {
        opacity: 1,
        angle: spring(endAngle, preset),
        rotation: spring(selectedArc.rotation + endAngle * i + i/2, preset),
        innerRadius: selectedArc.sexyChildren.radius.inner,
        outerRadius: selectedArc.sexyChildren.radius.outer,
      }
    }))
  }

  sexyChildrenWillEnter(entering) {
    const selectedArc = this.props.wheel.find(a => Boolean(a.selected && a.sexyChildren));
    const startAngle = selectedArc.sexyChildren.startAngle / selectedArc.sexyChildren.arcs.length;

    return {
      opacity: 1,
      angle: startAngle,
      rotation: selectedArc.sexyChildren.startRotation,
      innerRadius: entering.data.radius.inner,
      outerRadius: entering.data.radius.inner,
    }
  }

  sexyChildrenWillLeave(leaving) {
    const preset = presets[this.props.animationPreset];
    // hardcoded QQ
    const parentRotation = -54.25

    const width = leaving.data.radius.outer - leaving.data.radius.inner;

    return {
      opacity: spring(0.7),
      angle: leaving.style.angle,
      rotation: spring(parentRotation),
      innerRadius: spring(leaving.data.leaveTo, preset),
      outerRadius: spring(leaving.data.leaveTo, preset),
    };
  }

  render() {
    return (
      <Stage width={700} height={700}>
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
                {styles.map(({style, key, data: {children, active, selected, image, fill, id, innerRadius}}) =>
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
                      onClick={active ? this.props.onSelect.bind(undefined, id, selected) : undefined}
                    />
                  </Group>
                )}
              </Layer>
            }
          </TransitionMotion>
          {/* sexy children */}
          <TransitionMotion
            defaultStyles={this.getSexyChildrenDefaultStyles()}
            styles={this.getSexyChildrenStyles()}
            willEnter={this.sexyChildrenWillEnter.bind(this)}
            willLeave={this.sexyChildrenWillLeave.bind(this)}
          >
            {styles =>
              <Layer>
                {styles.map(({style, key, data}) =>
                  <Group
                    key={key}
                  >
                    <Arc
                      opacity={style.opacity}
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={data.fill}
                      rotation={style.rotation}
                    />
                  </Group>
                )}
              </Layer>
            }
          </TransitionMotion>
          {/* children */}
          <TransitionMotion
            defaultStyles={this.getChildrenDefaultStyles()}
            styles={this.getChildrenStyles()}
            willEnter={this.childrenWillEnter.bind(this)}
            willLeave={this.childrenWillLeave.bind(this)}
          >
            {styles =>
              <Layer>
                {styles.map(({style, key, data}) =>
                  <Group
                    key={key}
                  >
                    <Arc
                      angle={style.angle}
                      x={center.x}
                      y={center.y}
                      innerRadius={style.innerRadius}
                      outerRadius={style.outerRadius}
                      fill={data.fill}
                      rotation={style.rotation}
                    />
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
    );
  }
}
