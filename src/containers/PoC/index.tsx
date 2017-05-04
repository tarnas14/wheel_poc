import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import {Wheel} from '../../components';
import './style.css'

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

interface BusinessArc {
  id: string,
  icon: string,
  active?: boolean,
  focused?: boolean
}

const businessWheel = [
  {
    id: '1',
    icon: icons.home,
    active: true,
  },
  {
    id: '2',
    icon: icons.glass,
    active: true,
  },
  {
    id: '3',
    icon: icons.paw,
    active: true,
  },
  {
    id: '4',
    icon: icons.scales
  },
  {
    id: '5',
    icon: icons.phone,
  },
  {
    id: '6',
    icon: icons.injury
  },
  {
    id: '7',
    icon: icons.wheel
  },
];

const fromBusinessToMetal = businessWheel => {
  const sameAngle = 35;

  const getTemplate = ({active, focused, icon}) => {
    if (focused) {
      return {
        angle: sameAngle + 10,
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
    id: businessArc.id,
    active: businessArc.active,
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

export namespace PoC {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    circle: any,
    animationPreset: string
  }
}

export class PoC extends React.Component<PoC.Props, PoC.State> {

  constructor() {
    super();
    this.state = {
      wheel: businessWheel,
      circle: centerWheel,
      animationPreset: 'wobbly'
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
      animationPreset: preset
    })
  }

  focus = (id) => {
    this.setState({
      wheel: businessWheel.map(w => w.id === id
        ? {
          ...w,
          focused: true
        }
        : w)
    })
  }

  focusLost = (id) => {
    this.setState({
      wheel: businessWheel.map(w => w.id === id
        ? {
          ...w,
          focused: false
        }
        : w)
    })
  }

  render () {
    return <div>
      <button onClick={this.removeData.bind(this)}>hide</button>
      <button onClick={this.addDataAgain.bind(this)}>show</button>
      <select onChange={this.setPreset.bind(this)} value={this.state.animationPreset}>
        <option value="noWobble">noWobble</option>
        <option value="wobbly">wobbly</option>
        <option value="gentle">gentle</option>
        <option value="stiff">stiff</option>
      </select>
      <Wheel
        wheel={fromBusinessToMetal(this.state.wheel)}
        circle={this.state.circle}
        animationPreset={this.state.animationPreset}
        onFocus={this.focus.bind(this)}
        onFocusLost={this.focusLost.bind(this)}
      />
    </div>;
  }
}
