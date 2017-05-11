import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva';
import {TransitionMotion, Motion, spring, presets} from 'react-motion';
import Wheel from '../Wheel';
import * as style from './style.css'

const icons = {
  home: 'https://api.icons8.com/download/4662d6548b0042ab2fa5afe9429d21d7309b1559/windows10/PNG/256/Very_Basic/home-256.png',
  glass: 'https://d30y9cdsu7xlg0.cloudfront.net/png/86210-200.png',
  paw: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-animals/114688-magic-marker-icon-animals-animal-cat-print.png',
  phone: 'https://img.clipartfest.com/7a81181007424edbd234a5cefaf90e90_cell-phone-clipart-with-transparent-background-clipartfest-cell-phone-clipart-transparent_512-512.png',
  scales: 'https://d30y9cdsu7xlg0.cloudfront.net/png/331-200.png',
  wheel: 'http://www.tireworksmb.com/wp-content/uploads/2015/10/tire-icon.png',
  injury: 'https://d30y9cdsu7xlg0.cloudfront.net/png/191712-200.png'
};

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

export namespace CleanPoC {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    animationPreset: string,
    animationSetting: AnimationPreset,
    centerText: string,
    show: boolean,
  }
}

export class CleanPoC extends React.Component<CleanPoC.Props, CleanPoC.State> {

  constructor() {
    super();
    this.state = {
      wheel: businessWheel,
      animationPreset: 'wobbly',
      centerText: '',
      animationSetting: presets.wobbly,
      show: true,
    }
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
          focused: true
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
          focused: false
        }
        : w)
    }))
  }

  selected = (id) => {
    const wheel = this.state.wheel.find(w => w.id === id);
    if (!wheel) {
      return;
    }

    const {selected} = wheel;

    this.setState(s => ({
      centerText: selected ? '' : wheel.text,
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

  toggleShow = () => {
    this.setState(s => ({
      show: !s.show
    }));
  }

  render () {
    const {animationSetting: {stiffness, damping}} = this.state;
    return <div>
      {this.state.show && <Wheel
        wheel={this.state.wheel}
        animationPreset={this.state.animationSetting}
        onFocus={this.focus.bind(this)}
        onFocusLost={this.focusLost.bind(this)}
        onSelect={this.selected.bind(this)}
        setText={text => this.setState({centerText: text})}
        centerText={this.state.centerText}
      />
      }
      <div>
        <h3>Choose enter animation then click "toggle" twice to hide and show the wheel</h3>
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
    </div>;
  }
}
