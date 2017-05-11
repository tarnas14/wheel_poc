import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import {CleanWheel} from '../../components';
import * as style from './style.css'

const functions = [{
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: 35, outerRadius: spring(290, preset)}
      : {
        innerRadius: 90,
        rotation: -120 + i * 35,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad counter clockwise', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: 35, outerRadius: spring(290, preset)}
      : {
        innerRadius: 90,
        rotation:  -120 - i * 35,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad A', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
innerRadius: 90,
        rotation: -120 + i * 35,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad A counter clockwise', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
innerRadius: 90,
        rotation: -120 - i * 35,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad A Rot aka static fanout', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
        innerRadius: 90,
        rotation: previousStyles[i -1].rotation + previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rad A Rot counter clockwise', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
innerRadius: 90,
        rotation: previousStyles[i -1].rotation - previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'dynamic fanout', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: spring(-120 + i * 35), angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
innerRadius: 90,
        rotation: previousStyles[i -1].rotation + previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 0, outerRadius: 0},
  name: 'vortex', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: spring(90), rotation: spring(-120 + i * 35), angle: spring(35, preset), outerRadius: spring(290, preset)}
      : {
        innerRadius: previousStyles[i -1].innerRadius,
        rotation: previousStyles[i -1].rotation + previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle,
        outerRadius: previousStyles[i - 1].outerRadius
      }
  })
},{
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'sequence', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: 290}
      : {
        innerRadius: 90,
        rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle > 33 ? spring(35, preset) : 0,
        outerRadius: 290,
      }
  })
}, {
  init: {rotation: -270, angle: 0, innerRadius: 90, outerRadius: 90},
  name: 'Rot A', func: preset => previousStyles => previousStyles.map((_, i) => {
    return i === 0
      ? {innerRadius: 90, rotation: -120 + i * 35, angle: spring(35, preset), outerRadius: 290}
      : {
        innerRadius: 90,
        rotation: previousStyles[i - 1].rotation + previousStyles[i - 1].angle,
        angle: previousStyles[i - 1].angle,
        outerRadius: 290,
      }
  })
}]

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

const maxRadius = 490;

const centerWheel = {
  opacity: 0.5,
  fill: '#95a5a6',
  radius: {
    inner: 80,
    outer: 90
  }
};

const middleRadius = {
  inner: centerWheel.radius.inner,
  outer: centerWheel.radius.outer + (centerWheel.radius.inner * 2 * 1.15)
}

const bigRadius = {
  ...middleRadius,
  outer: middleRadius.outer * 1.15
}

const smallRadius = {
  ...middleRadius,
  outer: middleRadius.outer * 0.85
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
        image: getImage(icon, {width: 90, height: 90}, {offsetScale: 0.8})
      }
    }

    if (focused) {
      return active
        ? {
          angle: focusedAngle,
          fill: '#00fff0',
          opacity: 1,
          radius: bigRadius,
          image: getImage(icon, {width: 70, height: 70})
        }
        : {
          angle: focusedAngle,
          fill: '#34495e',
          opacity: 1,
          radius: middleRadius,
          image: getImage(icon, {width: 50, height: 50})
        }
    }

    if (active) {
      return {
        angle: sameAngle,
        fill: '#00fff0',
        opacity: 0.7,
        radius: middleRadius,
        image: getImage(icon, {width: 50, height: 50})
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

export namespace CleanPoC {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    circle: any,
    animationPreset: string,
    animationSetting: AnimationPreset,
    centerText: string,
    showChildren: boolean,
    show: boolean,
    animation: {init: any, name: string, func: (preset: AnimationPreset) => (sth: any[]) => any[]}
  }
}

export class CleanPoC extends React.Component<CleanPoC.Props, CleanPoC.State> {

  constructor() {
    super();
    this.state = {
      wheel: businessWheel,
      circle: centerWheel,
      animationPreset: 'wobbly',
      centerText: '',
      animationSetting: presets.wobbly,
      showChildren: true,
      show: true,
      animation: functions[0]
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
    if (!this.state.wheel.filter(w => w.id === id).length) {
      return;
    }

    this.setState(s => ({
      centerText: s.wheel.find(w => w.id === id).text,
      wheel: s.wheel.map(w => w.id === id
        ? {
          ...w,
          focused: true,
          children: w.children ? w.children.map(child => ({
            ...child,
          })) : undefined
        }
        : w)
    }))
  }

  focusLost = (id) => {
    if (!this.state.wheel.filter(w => w.id === id).length) {
      return;
    }

    this.setState(s => ({
      centerText: s.wheel.filter(w => w.selected).length ? s.wheel.find(w => w.selected).text : '',
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
    if (!this.state.wheel.filter(w => w.id === id).length) {
      return;
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

  showChildren = (e) => {
    this.setState(s => ({
      showChildren: !s.showChildren
    }))
  }

  toggleShow = () => {
    this.setState(s => ({
      show: !s.show
    }));
  }

  changeFunc = (e) => {
    const f = e.currentTarget.value;
    this.setState(s => ({
      animation: functions.find(func => func.name === f)
    }))
  }

  render () {
    const {animationSetting: {stiffness, damping}} = this.state;
    return <div>
      <div>
        <h3>Choose enter animation then click "toggle" twice to hide and show the wheel</h3>
        <select style={{margin: '15px', marginLeft: '0', padding: '15px'}}value={this.state.animation.name} onChange={this.changeFunc.bind(this)}>
          {functions.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
        </select>
      </div>
      <button onClick={this.toggleShow.bind(this)}>toggle</button>
      <h3>animation settings here</h3>
      <div>
        <select onChange={this.setPreset.bind(this)} value={this.state.animationPreset}>
          <option value="noWobble">noWobble</option>
          <option value="wobbly">wobbly</option>
          <option value="gentle">gentle</option>
          <option value="stiff">stiff</option>
        </select>
      </div>
      <p>
        stiffness: ({stiffness}) <br/> <input type="range" min="0" max="300" value={stiffness} onChange={this.changeStiffness.bind(this)}/>
      </p>
      <p>
        damping: ({damping}) <br /> <input type="range" min="0" max="40" value={damping} onChange={this.changeDamping.bind(this)}/>
      </p>
      {this.state.show && <CleanWheel
        wheel={[
          ...toWheel(this.state.wheel && fromBusinessToMetal(this.state.wheel.map(w => ({...w, children: this.state.showChildren ? w.children : []}))))
        ]}
        circle={this.state.circle}
        animationPreset={this.state.animationSetting}
        onFocus={this.focus.bind(this)}
        onFocusLost={this.focusLost.bind(this)}
        onSelect={this.selected.bind(this)}
        setText={text => this.setState({centerText: text})}
        centerText={this.state.centerText}
        animation={this.state.animation.func}
        initialAnimationState={this.state.animation.init}
      />
      }
    </div>;
  }
}
