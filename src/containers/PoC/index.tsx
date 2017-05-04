import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import './style.css'

interface ImageWithPromise {
  image: any,
  size: {height: number, width: number},
  loaded: Promise<void>
}

namespace MyImage {
  export interface Props {
    image: ImageWithPromise
  }

  export interface State {
    image: any
  }
}

class MyImage extends React.Component<MyImage.Props, MyImage.State> {
  constructor () {
    super();
    this.state = {image: undefined}
  }

  componentDidMount () {
    const {image} = this.props;
    image.loaded.then(() => this.setState({
      image: image.image
    }))
  }

  render() {
    const {image} = this.state;
    const {height, width} = this.props.image.size;
    return image
      ? <KonvaImage
        image={image}
        height={height}
        width={width}
      />
      : null
  }
}

const getImage = (src, size, additional = {}): ImageWithPromise => {
  const img = new Image();
  img.src = src;

  const loaded = new Promise<void>(resolve => {
    img.onload = () => resolve()
  });

  return {
    image: img,
    size: size,
    loaded: loaded,
    ...additional
  };
}

const icons = {
  home: 'https://api.icons8.com/download/4662d6548b0042ab2fa5afe9429d21d7309b1559/windows10/PNG/256/Very_Basic/home-256.png',
  glass: 'https://d30y9cdsu7xlg0.cloudfront.net/png/86210-200.png',
  paw: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-animals/114688-magic-marker-icon-animals-animal-cat-print.png',
  phone: 'https://img.clipartfest.com/7a81181007424edbd234a5cefaf90e90_cell-phone-clipart-with-transparent-background-clipartfest-cell-phone-clipart-transparent_512-512.png',
  scales: 'https://d30y9cdsu7xlg0.cloudfront.net/png/331-200.png',
  wheel: 'http://www.tireworksmb.com/wp-content/uploads/2015/10/tire-icon.png',
  injury: 'https://d30y9cdsu7xlg0.cloudfront.net/png/191712-200.png'
};

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
  opacity: number,
  image?: any
}

interface MotionArc extends Arc {
  rotation: number
}

const sameAngle = 35;

const middleRadius = {
    inner: centerWheel.radius.inner,
    outer: centerWheel.radius.outer + 120
}

const bigRadius = {
    ...middleRadius,
    outer: middleRadius.outer + 30
}

const smallRadius = {
    ...middleRadius,
    outer: middleRadius.outer - 30
}

const middleWheel = {
  initialRadius: middleRadius,
  startRotation: -126,
  arcs: [
    {
      id: '1',
      angle: sameAngle,
      fill: '#00fff0',
      opacity: 0.7,
      radius: middleRadius,
      image: getImage(icons.home, {width: 40, height: 40})
    },
    {
      id: '2',
      angle: sameAngle + 10,
      fill: '#00fff0',
      opacity: 1,
      radius: bigRadius,
      image: getImage(icons.glass, {width: 60, height: 60}),
    },
    {
      id: '3',
      angle: sameAngle,
      fill: '#00fff0',
      opacity: 0.8,
      radius: middleRadius,
      image: getImage(icons.paw, {width: 50, height: 50}),
    },
    {
      id: '4',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.5,
      radius: smallRadius,
      image: getImage(icons.scales, {width: 40, height: 40}, {opacity: 0.5})
    },
    {
      id: '5',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.4,
      radius: smallRadius,
      image: getImage(icons.phone, {width: 40, height: 40}, {opacity: 0.6})
    },
    {
      id: '6',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.6,
      radius: smallRadius,
      image: getImage(icons.injury, {width: 40, height: 40}, {opacity: 0.5})
    },
    {
      id: '7',
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.5,
      radius: smallRadius,
      image: getImage(icons.wheel, {width: 40, height: 40}, {opacity: 0.4})
    },
    {
      id: 'plus',
      angle: 97,
      fill: '',
      radius: {
        inner: centerWheel.radius.inner,
        outer: centerWheel.radius.outer + 105
      },
      image: getImage('http://www.clker.com/cliparts/L/q/T/i/P/S/add-button-white-hi.png', {width: 50, height: 50})
    }
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
    return {
      angle: 0,
      rotation: 0,
      opacity: 0,
      innerRadius: centerWheel.radius.inner,
      outerRadius: centerWheel.radius.inner,
      imageHeight: 0,
      imageWidth: 0,
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
      innerRadius: centerWheel.radius.inner,
      outerRadius: centerWheel.radius.inner
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
                <Layer>
                  {styles.map(({style, key, data: {image, fill, innerRadius}}) =>
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
                      />
                    </Group>
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
      </div>
    );
  }
}
