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
import Settings from './Settings'

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
    id: '7i',
    icon: icons.wheel,
    text: '',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: 'iolaiwer0',
    icon: icons.wheel,
    text: '',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '7ilakjwer',
    icon: icons.wheel,
    text: '',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '8i',
    icon: icons.injury,
    text: 'dummy',
    state: State.suggestion,
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

  setAngle = angle => {
    this.setState(s => ({wheelSettings: {...s.wheelSettings, angle}}))
  }

  setPalette = selected => this.setState({
    colourPalette: palettes.find(p => p.name === selected)
  })

  setCenterRadius = d => this.setState(s => ({wheelSettings: {...s.wheelSettings, centerArea: {outer: d}}}))

  setActiveRadius = d => this.setState(s => ({wheelSettings: {...s.wheelSettings, activeRadius: d}}))

  setPendingRadius = r => this.setState(s => ({wheelSettings: {...s.wheelSettings, pendingRadius: r}}))

  setSuggestionRadius = r => this.setState(s => ({wheelSettings: {...s.wheelSettings, suggestionRadius: r}}))

  render () {
    const {animationPreset, animationSetting, wheelSettings, wheel, colourPalette} = this.state
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

      <Settings
        animationPreset={animationPreset}
        animationSetting={animationSetting}
        wheelSettings={wheelSettings}
        wheel={wheel}
        setAngle={this.setAngle}
        setPalette={this.setPalette}
        palettes={palettes}
        selectedPalette={colourPalette.name}
        changeStiffness={this.changeStiffness}
        changeDamping={this.changeDamping}
        setPreset={this.setPreset}
        setCenterRadius={this.setCenterRadius}
        setActiveRadius={this.setActiveRadius}
        setPendingRadius={this.setPendingRadius}
        setSuggestionRadius={this.setSuggestionRadius}
        addToWheel={this.addToWheel}
        removeFromWheel={this.removeFromWheel}
      />

    </div>
  }
}
