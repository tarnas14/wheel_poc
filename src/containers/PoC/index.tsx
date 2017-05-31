import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {TransitionMotion, Motion, spring, presets} from 'react-motion'
import * as style from './style.css'
import State from '../../constants/state'
import OriginalColourPalette from '../../constants/colourPalette'
import DbColourPalette from '../../constants/dbColourPalette'
import NewDbColourPalette from '../../constants/newDbColourPalette'
import Dashboard from '../Dashboard'

import plusPath from '../../glyphs/paths/plus'
import homePath from '../../glyphs/paths/hausrat'
import glassPath from '../../glyphs/paths/glas'
import petPath from '../../glyphs/paths/tierhalterhaftpflicht'
import phonePath from '../../glyphs/paths/handy'
import scalesPath from '../../glyphs/paths/rechtsschutz'
import kfzPath from '../../glyphs/paths/kfz'
import injuryPath from '../../glyphs/paths/unfall'

const icons = {
  home: homePath,
  glass: glassPath,
  paw: petPath,
  phone: phonePath,
  scales: scalesPath,
  wheel: kfzPath,
  injury: injuryPath,
  plus: plusPath,
}

const palettes = [
  {
    name: 'original',
    palette: OriginalColourPalette,
  },
  {
    name: 'db',
    palette: DbColourPalette,
  },
  {
    name: 'new db',
    palette: NewDbColourPalette,
  },
]

// const debug = (wheel: BusinessArc[]) : BusinessArc[] => console.log(wheel) || wheel.map(w => console.log(w && w.collapsed) || w)
const debug = w => w

const businessWheel: BusinessArc[] = [
  {
    id: 'plus',
    icon: icons.plus,
    text: '',
    state: State.plus,
    schabo: 0,
  },
  {
    id: '-2',
    icon: icons.home,
    text: 'collapsed -2',
    state: State.active,
    schabo: 0,
    dontDisplay: true,
  },
  {
    id: '-1',
    icon: icons.home,
    text: 'collapsed -1',
    state: State.active,
    schabo: 0,
    dontDisplay: true,
  },
  {
    id: '0',
    icon: icons.glass,
    text: 'collapsed 0',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('collapsed 0'),
    dontDisplay: true,
  },
  {
    id: '1',
    icon: icons.home,
    text: 'Hausrat',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('hausrat'),
    dontDisplay: true,
  },
  {
    id: 'glass',
    icon: icons.glass,
    text: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
    dontDisplay: true,
  },
  {
    id: '3',
    icon: icons.paw,
    text: 'Tierhalterhaftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('tierhalterhaftpflicht'),
    dontDisplay: true,
  },
  {
    id: 'aljer',
    icon: icons.glass,
    text: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
    dontDisplay: true,
  },
  {
    id: 'alwkejral',
    icon: icons.glass,
    text: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
  },
  {
    id: '4wzpdi',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4zlxckvj',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4ouowai',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4awe',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4',
    icon: icons.scales,
    text: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '5',
    icon: icons.phone,
    text: 'Handyversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6lajer',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.1',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.2',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.3',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.4',
    icon: icons.injury,
    text: '',
    state: State.pending,
    dontDisplay: true,
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
    id: 'olaiwer0',
    icon: icons.wheel,
    text: '',
    state: State.suggestion,
    schabo: 0,
  },
  {
    id: '7lakjwer',
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

const onEnter = callback => e => e.keyCode === 13
  ? callback(e)
  : undefined

interface Props extends RouteComponentProps<void> { }

interface State {
  wheel: BusinessArc[],
  animationPreset: string,
  animationSetting: AnimationPreset,
  wheelSettings: WheelSettings,
  colourPalette: any
}

export default class extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      wheel: businessWheel,
      animationPreset: 'noWobble',
      animationSetting: presets.noWobble,
      colourPalette: palettes[2],
      wheelSettings: {
        start: {
          referenceElementIndex: 1,
          startRotation: -80,
        },
        plusMinSize: 40,
        origin: {
          x: 360,
          y: 360,
        },
        centerArea: {
          inner: 175/2, // not used
          outer: 175/2,
        },
        angle: 40,
        cdRadius: {
          inner: 100/2,
          outer: 275,
        },
        activeRadius: 275,
        pendingRadius: 225,
        suggestionPadding: 5,
        suggestionRadius: 175,
      }
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

  select = (id: string) => {
    this.setState(s => ({
      wheel: s.wheel.map(w => ({
        ...w,
        selected: w.id === id,
        hidden: w.id !== id
      }))
    }))
  }

  clearSelection = () => {
    this.setState(s => ({
      wheel: s.wheel.map(w => ({
        ...w,
        selected: false,
        hidden: false
      }))
    }))
  }

  addToWheel = state => {
    this.setState(s => {
      const wheel = [...s.wheel].reverse()
      return {
        wheel: [
          ...wheel.slice(0, wheel.findIndex(w => w.dontDisplay && w.state === state)),
          {...wheel.find(w => w.dontDisplay && w.state === state), dontDisplay: false},
          ...wheel.slice(wheel.findIndex(w => w.dontDisplay && w.state === state) + 1)
        ].reverse()
      }
    })
  }

  removeFromWheel = state => {
    this.setState(s => ({
      wheel: [
        ...s.wheel.slice(0, s.wheel.findIndex(w => !w.dontDisplay && w.state === state)),
        {...s.wheel.find(w => !w.dontDisplay && w.state === state), dontDisplay: true},
        ...s.wheel.slice(s.wheel.findIndex(w => !w.dontDisplay && w.state === state) + 1)
      ]
    }))
  }

  renderSettings = () => {
    const {animationSetting, wheelSettings, wheel} = this.state
    const {stiffness, damping} = animationSetting
    return <div>
      <div className={style.settings}>
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
      <div className={style.settings}>
        <h3>wheel settings here</h3>
        <p>
          angle: ({wheelSettings.angle})
          <br />
          <input type="range" min="0" max="100" value={wheelSettings.angle}
            onChange={e => {
              const value = Number(e.currentTarget.value)
              this.setState(s => ({wheelSettings: {...s.wheelSettings, angle: value}}))}
            }
          />
        </p>
        <p>
          center diameter: ({wheelSettings.centerArea.outer * 2})
          <br />
          <input type="range" min="0" max="300" value={wheelSettings.centerArea.outer}
            onChange={e => {
              const value = Number(e.currentTarget.value)
              this.setState(s => ({wheelSettings: {...s.wheelSettings, centerArea: {outer: value}}}))}
            }
          />
        </p>
        <p>
          <input type="number" defaultValue={`${wheelSettings.centerArea.outer * 2}`}
            onKeyDown={onEnter(e => {
              const value = Number(e.currentTarget.value)/2
              this.setState(s => ({wheelSettings: {...s.wheelSettings, centerArea: {outer: value}}}))
            })}
          />
        </p>
      </div>
      <div className={style.settings}>
        <p>
          active diameter: ({wheelSettings.activeRadius * 2})
          <br />
          <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.activeRadius}
            onChange={e => {
              const value = Number(e.currentTarget.value)
              this.setState(s => ({wheelSettings: {...s.wheelSettings, activeRadius: value}}))}
            }
          />
        </p>
        <p>
          pending diameter: ({wheelSettings.pendingRadius * 2})
          <br />
          <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.pendingRadius}
            onChange={e => {
              const value = Number(e.currentTarget.value)
              this.setState(s => ({wheelSettings: {...s.wheelSettings, pendingRadius: value}}))}
            }
          />
        </p>
        <p>
          suggestion diameter: ({wheelSettings.suggestionRadius * 2})
          <br />
          <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.suggestionRadius}
            onChange={e => {
              const value = Number(e.currentTarget.value)
              this.setState(s => ({wheelSettings: {...s.wheelSettings, suggestionRadius: value}}))}
            }
          />
        </p>
      </div>
      <div className={style.settings}>
        <p>
          <button onClick={() => this.addToWheel(State.active)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.active))}>+ active</button>
          <button onClick={() => this.removeFromWheel(State.active)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.active).length)}>- active</button>
        </p>
        <p>
          <button onClick={() => this.addToWheel(State.pending)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.pending))}>+ pending</button>
          <button onClick={() => this.removeFromWheel(State.pending)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.pending).length)}>- pending</button>
        </p>
        <p>
          <button onClick={() => this.addToWheel(State.suggestion)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.suggestion))}>+ suggestion</button>
          <button onClick={() => this.removeFromWheel(State.suggestion)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.suggestion).length)}>- suggestion</button>
        </p>
      </div>
      <div className={style.settings}>
        <p>
          <label>colour palette
            <select value={this.state.colourPalette.name} onChange={e => {
              const selected = e.currentTarget.value
              this.setState({
                colourPalette: palettes.find(p => p.name === selected)
              })
            }}>
              {palettes.map(({name}) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </p>
      </div>
    </div>
  }

  render () {
    const {animationSetting, wheelSettings, wheel, colourPalette} = this.state
    const {stiffness, damping} = animationSetting

    return <div className={style.everything}>
      <div className={style.dashboardContainer} style={{backgroundColor: colourPalette.palette.background}}>
        <Dashboard
          wheel={wheel}
          settings={wheelSettings}
          animationSetting={animationSetting}
          select={this.select}
          clearSelection={this.clearSelection}
          colourPalette={colourPalette.palette}
        />
      </div>

      {this.renderSettings()}

    </div>
  }
}
