import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import {Wheel} from '../../components';
import * as style from './style.css'

const sameAngle = 35;
const focusedAngle = sameAngle + 10;
const selectedAngle = sameAngle * 2 + 10;

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0);

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
    offsetScale: 0.9,
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

const childRadius = {
  inner: bigRadius.outer + 1,
  outer: bigRadius.outer + 46
}

interface BusinessArc {
  id: string,
  icon: string,
  text: string,
  selected?: boolean,
  active?: boolean,
  focused?: boolean,
  children?: MotionArc[],
}

const testChildAngle = 26;
const testChildren = [
  {
    angle: 0,
    fill: 'blue',
    radius: {
      inner: bigRadius.outer,
      outer: bigRadius.outer
    },
    leavingRadiusTarget: middleRadius.outer,
    id: 'test_blue',
    opacity: 1,
    rotation: -90.25
  },
  {
    angle: 0,
    fill: 'yellow',
    radius: {
      inner: bigRadius.outer,
      outer: bigRadius.outer
    },
    leavingRadiusTarget: middleRadius.outer,
    id: 'test_yellow',
    opacity: 1,
    rotation: -63.5
  },
  {
    angle: 0,
    fill: 'red',
    radius: {
      inner: bigRadius.outer,
      outer: bigRadius.outer
    },
    leavingRadiusTarget: middleRadius.outer,
    id: 'test_red',
    opacity: 1,
    rotation: -36
  }
];

const businessWheel: BusinessArc[] = [
  {
    id: '1',
    icon: icons.home,
    active: true,
    text: 'Hausrat'
  },
  {
    id: 'glass',
    icon: icons.glass,
    active: true,
    children: testChildren,
    text: 'Privat Haftpflicht'
  },
  {
    id: '3',
    icon: icons.paw,
    active: true,
    text: 'Tierhalterhaftpflicht',
  },
  {
    id: '4',
    icon: icons.scales,
    text: ''
  },
  {
    id: '5',
    icon: icons.phone,
    text: ''
  },
  {
    id: '6',
    icon: icons.injury,
    text: ''
  },
  {
    id: '7',
    icon: icons.wheel,
    text: ''
  },
];

const fromBusinessToMetal = businessWheel => {
  if (!businessWheel) {
    return {
      startRotation: 0,
      arcs: []
    }
  }

  const getTemplate = ({active, focused, selected, icon}) => {
    if (selected) {
      return {
        angle: selectedAngle,
        fill: '#00fff0',
        opacity: 1,
        radius: bigRadius,
        image: getImage(icon, {width: 80, height: 80}, {offsetScale: 0.75})
      }
    }

    if (focused) {
      return {
        angle: focusedAngle,
        fill: '#00fff0',
        opacity: 1,
        radius: bigRadius,
        image: getImage(icon, {width: 60, height: 60})
      }
    }

    if (active) {
      return {
        angle: sameAngle,
        fill: '#00fff0',
        opacity: 0.7,
        radius: middleRadius,
        image: getImage(icon, {width: 40, height: 40})
      }
    }

    return {
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.5,
      radius: smallRadius,
      image: getImage(icon, {width: 40, height: 40}, {opacity: 0.5})
    }
  }

  const arcs = businessWheel.map(businessArc => ({
    ...businessArc,
    ...getTemplate(businessArc)
  }));

  return {
    startRotation: -126,
    arcs: [
      ...arcs,
      {
        id: 'plus',
        angle: 360 - sumAngles(arcs) - arcs.length - 1,
        fill: '',
        radius: {
          inner: centerWheel.radius.inner,
          outer: centerWheel.radius.outer + 105
        },
        image: getImage('http://www.clker.com/cliparts/L/q/T/i/P/S/add-button-white-hi.png', {width: 50, height: 50})
      }
    ]
  };
}

const toWheel = (wheel): MotionArc[] => wheel ? wheel.arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: wheel.startRotation + sumAngles(allArcs) + allArcs.length
  }]
}, []) : [];

export namespace PoC {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    testChildren: MotionArc[],
    circle: any,
    animationPreset: string,
    animationSetting: AnimationPreset,
    centerText: string
  }
}

export class PoC extends React.Component<PoC.Props, PoC.State> {

  constructor() {
    super();
    this.state = {
      wheel: businessWheel,
      testChildren: [],
      circle: centerWheel,
      animationPreset: 'wobbly',
      centerText: '',
      animationSetting: presets.wobbly
    }
  }

  removeData = () => {
    this.setState({
      wheel: undefined,
      circle: undefined
    });
  }

  addDataAgain = () => {
    this.setState({
      wheel: businessWheel,
      circle: centerWheel
    })
  }

  setPreset = (e) => {
    const preset = e.currentTarget.value;
    this.setState({
      animationPreset: preset,
      animationSetting: presets[preset]
    })
  }

  focus = (id) => {
    this.setState(s => ({
      centerText: s.wheel.find(w => w.id === id).text,
      wheel: s.wheel.map(w => w.id === id
        ? {
          ...w,
          focused: true,
          children: w.children ? w.children.map(child => ({
            ...child,
            radius: childRadius,
            angle: testChildAngle
          })) : undefined
        }
        : w)
    }))
  }

  focusLost = (id) => {
    this.setState(s => ({
      centerText: '',
      wheel: s.wheel.map(w => w.id === id
        ? {
          ...w,
          focused: false,
          children: w.children ? w.children.map(child => ({
            ...child,
            radius: {
              inner: bigRadius.outer,
              outer: bigRadius.outer
            },
            angle: 0
          })) : undefined
        }
        : w)
    }))
  }

  selected = (id, selected) => {
    this.setState({
      testChildren: []
    });

    if (id === 'glass' && !selected) {
      this.setState({
        testChildren: testChildren
      });
    }

    this.setState(s => ({
      centerText: selected ? '' : s.wheel.find(w => w.id === id).text,
      wheel: s.wheel.map(w => w.id === id
        ? {
          ...w,
          selected: !w.selected,
          focused: false
        }
        : {
          ...w,
          selected: false
        })
    }))
  }

  changeStiffness = (e) => {
    const val = e.currentTarget.value;
    this.setState(s => ({
      animationSetting: {
        ...s.animationSetting,
        stiffness: val
      }
    }))
  }

  changeDamping = (e) => {
    const val = e.currentTarget.value;
    this.setState(s => ({
      animationSetting: {
        ...s.animationSetting,
        damping: val
      }
    }))
  }

  render () {
    const {animationSetting: {stiffness, damping}} = this.state;
    return <div>
      <button onClick={this.removeData.bind(this)}>hide</button>
      <button onClick={this.addDataAgain.bind(this)}>show</button>
      <select onChange={this.setPreset.bind(this)} value={this.state.animationPreset}>
        <option value="noWobble">noWobble</option>
        <option value="wobbly">wobbly</option>
        <option value="gentle">gentle</option>
        <option value="stiff">stiff</option>
      </select>
      <p>
        stiffness: ({stiffness}) <br/> <input type="range" min="0" max="300" value={stiffness} onChange={this.changeStiffness.bind(this)}/>
      </p>
      <p>
        damping: ({damping}) <br /> <input type="range" min="0" max="40" value={damping} onChange={this.changeDamping.bind(this)}/>
      </p>
      <div className={style.circleTextContainer}>
        <p>{this.state.centerText}</p>
      </div>
      <Wheel
        wheel={[
          ...toWheel(fromBusinessToMetal(this.state.wheel))
        ]}
        circle={this.state.circle}
        animationPreset={this.state.animationSetting}
        onFocus={this.focus.bind(this)}
        onFocusLost={this.focusLost.bind(this)}
        onSelect={this.selected.bind(this)}
      />
    </div>;
  }
}
