import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {TransitionMotion, Motion, spring, presets} from 'react-motion'
import BusinessWheel from '../BusinessWheel'
import * as style from './style.css'
import State from '../../constants/state'

const icons = {
  home: 'https://api.icons8.com/download/4662d6548b0042ab2fa5afe9429d21d7309b1559/windows10/PNG/256/Very_Basic/home-256.png',
  glass: 'https://d30y9cdsu7xlg0.cloudfront.net/png/86210-200.png',
  paw: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-animals/114688-magic-marker-icon-animals-animal-cat-print.png',
  phone: 'https://img.clipartfest.com/7a81181007424edbd234a5cefaf90e90_cell-phone-clipart-with-transparent-background-clipartfest-cell-phone-clipart-transparent_512-512.png',
  scales: 'https://d30y9cdsu7xlg0.cloudfront.net/png/331-200.png',
  wheel: 'http://www.tireworksmb.com/wp-content/uploads/2015/10/tire-icon.png',
  injury: 'https://d30y9cdsu7xlg0.cloudfront.net/png/191712-200.png'
}

const businessWheel: BusinessArc[] = [
  // {
    // id: '-2',
    // icon: icons.home,
    // text: 'collapsed -2',
    // state: 'active',
  // },
  // {
    // id: '-1',
    // icon: icons.home,
    // text: 'collapsed -1',
    // state: 'active',
  // },
  {
    id: '0',
    icon: icons.glass,
    text: 'collapsed 0',
    state: State.active,
    schabo: 0,
  },
  {
    id: '1',
    icon: icons.home,
    text: 'Hausrat',
    state: State.active,
    schabo: 13,
  },
  {
    id: 'glass',
    icon: icons.glass,
    text: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
  },
  {
    id: '3',
    icon: icons.paw,
    text: 'Tierhalterhaftpflicht',
    state: State.active,
    schabo: 10.75,
  },
  {
    id: '4',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    schabo: 0,
  },
  {
    id: '5',
    icon: icons.phone,
    text: 'Handyversicherung',
    state: State.pending,
    schabo: 0,
  },
  {
    id: '6',
    icon: icons.injury,
    text: '',
    state: State.pending,
    schabo: 0,
  },
  {
    id: '7',
    icon: icons.wheel,
    text: '',
    state: State.suggestion,
    schabo: 0,
  },
  {
    id: '8',
    icon: icons.injury,
    text: 'dummy',
    state: State.suggestion,
    schabo: 0,
  }
]

const additionalInfos = [
  {
    key: '1',
    text: `Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.`
  },
  {
    key: '2',
    text: `Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house, fuckin' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, 'cause I'll kill the motherfucker, know what I'm sayin'?`
  },
  {
    key: '3',
    text: `Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they're actually proud of that shit.`
  }
]

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    animationPreset: string,
    animationSetting: AnimationPreset,
    previousText: any,
    centerText: any,
    show: boolean,
    additionalInfo: {key: string, text: string}[],
    slideFromLeft: boolean
  }
}

const getSchaboText = (businessWheel: BusinessArc[]) => <span><b style={{fontSize: '1.4em'}}>{businessWheel.reduce((accumulator, current) => accumulator + current.schabo, 0)} €</b> Schadensfreibonus</span>

export class Dashboard extends React.Component<Dashboard.Props, Dashboard.State> {

  constructor() {
    super()
    this.state = {
      wheel: businessWheel,
      animationPreset: 'noWobble',
      previousText: '',
      centerText: getSchaboText(businessWheel),
      animationSetting: presets.noWobble,
      show: true,
      additionalInfo: [additionalInfos[0]],
      slideFromLeft: false
    }
  }

  setPreset = (e) => {
    const preset = e.currentTarget.value
    this.setState({
      animationPreset: preset,
      animationSetting: presets[preset]
    })
  }

  changeStiffness = (e) => {
    const val = e.currentTarget.value
    this.setState(s => ({
      animationSetting: {
        ...s.animationSetting,
        stiffness: val
      }
    }))
  }

  changeDamping = (e) => {
    const val = e.currentTarget.value
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
    }))
  }

  getDefaultStyles = () => {
    return this.state.additionalInfo.map(i => ({
      ...i,
      data: i,
      style: {
        opacity: 1,
        left: 0
      }
    }))
  }

  getStyles = () => {
    return this.state.additionalInfo.map(i => ({
      ...i,
      data: i,
      style: {
        opacity: spring(1, this.state.animationSetting),
        left: spring(0, this.state.animationSetting)
      }
    }))
  }

  willLeave = () => {
    const {slideFromLeft} = this.state

    return {
      opacity: spring(0, this.state.animationSetting),
      left: slideFromLeft ? spring(100, this.state.animationSetting) : spring(-100, this.state.animationSetting)
    }
  }

  willEnter = () => {
    const {slideFromLeft} = this.state

    return {
      opacity: 0,
      left: slideFromLeft ? -100 : 100
    }
  }

  changeAdditionalInfo = () => {
    this.setState(s => {
      const currentKey = Number(s.additionalInfo[0].key)
      const nextKey = (currentKey === 3 ? 1 : currentKey + 1) - 1

      return {
        additionalInfo: [additionalInfos[nextKey]]
      }
    })
  }

  select = (id: string) => {
    this.setState(s => ({
      previousText: s.centerText,
      centerText: '',
      wheel: s.wheel.map(w => ({
        ...w,
        selected: w.id === id,
        hidden: w.id !== id
      }))
    }))
  }

  unselect = () => {
    this.setState(s => ({
      previousText: s.centerText,
      centerText: s.previousText,
      wheel: s.wheel.map(w => ({
        ...w,
        selected: false,
        hidden: false
      }))
    }))
  }

  render () {
    const {animationSetting: {stiffness, damping}} = this.state
    return <div>
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {styles => <div className={style.additionalInfo}>
          {styles.map(({key, style, data}) => <div
            key={key}
            style={{
              opacity: style.opacity.toString(),
              left: `${style.left}%`
            }}
          >
            <h2>additional information here</h2>
            <p>
              {data.text}
            </p>
          </div>)}
        </div>}
      </TransitionMotion>
      <hr className={style.divider}/>
      <button onClick={this.unselect}>deselect</button>
      {this.state.show && <BusinessWheel
        wheel={this.state.wheel}
        animationPreset={this.state.animationSetting}
        centerText={this.state.centerText}
        select={this.select}
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
    </div>
  }
}
