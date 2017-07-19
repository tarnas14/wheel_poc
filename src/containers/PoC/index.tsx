import * as React from 'react'
import {Route, Switch} from 'react-router'
import {Link} from 'react-router-dom'
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {TransitionMotion, Motion, spring, presets} from 'react-motion'
import * as style from './style.css'
import State from '../../constants/state'
import OriginalColourPalette from '../../constants/colourPalette'
import DbColourPalette from '../../constants/dbColourPalette'
import NewDbColourPalette from '../../constants/newDbColourPalette'
import Dashboard from '../../dashboard/containers/Dashboard'
import Settings from './Settings'
import '../../dashboard/types/models'

import plusPath from '../../glyphs/paths/plus'
import homePath from '../../glyphs/paths/hausrat'
import glassPath from '../../glyphs/paths/glas'
import petPath from '../../glyphs/paths/tierhalterhaftpflicht'
import phonePath from '../../glyphs/paths/handy'
import scalesPath from '../../glyphs/paths/rechtsschutz'
import kfzPath from '../../glyphs/paths/kfz'
import injuryPath from '../../glyphs/paths/unfall'

const wheelSettings = {
  start: {
    referenceElementIndex: 1,
    startRotation: -80,
  },
  spacing: 2,
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
    inner: 0,
    outer: 275,
  },
  activeRadius: 275,
  pendingRadius: 225,
  suggestionPadding: 5,
  suggestionRadius: 175,
    standardIconDimensions: {
      width: 210,
      height: 210
  },
  iconSizes: {
    big: {width: 90, height: 90},
    small: {width: 42, height: 42}
  },
  shadowSettings: {
    arc: {
      blur: 15,
      opacity: 0.5,
      enabled: true,
      disableWhenSelected: true,
      offset: {
        x: -3,
        y: 5
      }
    }
  }
}

const icons = {
  home: {
      path: homePath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  glass: {
      path: glassPath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  paw: {
      path: petPath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  phone: {
      path: phonePath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  scales: {
      path: scalesPath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  wheel: {
      path: kfzPath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  injury: {
      path: injuryPath,
      svgDimensions: wheelSettings.standardIconDimensions
  },
  plus: {
    path: plusPath,
    svgDimensions: {width: 68, height: 68}
  }
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
    category: 'PrivatHaftpflicht',
    state: State.plus,
    schabo: 0,
  },
  {
    id: '-2',
    icon: icons.home,
    category: 'Kfz',
    state: State.active,
    schabo: 0,
    dontDisplay: true,
  },
  {
    id: '-1',
    icon: icons.home,
    category: 'Glas',
    state: State.active,
    schabo: 0,
    dontDisplay: true,
  },
  {
    id: '0',
    icon: icons.glass,
    category: 'Sonstige Krankenzusatzversicherung',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('collapsed 0'),
    dontDisplay: true,
  },
  {
    id: '1',
    icon: icons.home,
    category: 'Hausrat',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('hausrat'),
    dontDisplay: true,
  },
  {
    id: 'glass',
    icon: icons.glass,
    category: 'Tierhalterhaftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
    dontDisplay: true,
  },
  {
    id: '3',
    icon: icons.paw,
    category: 'Tierhalterhaftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('tierhalterhaftpflicht'),
    dontDisplay: true,
  },
  {
    id: 'aljer',
    icon: icons.glass,
    category: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
    dontDisplay: true,
  },
  {
    id: 'alwkejral',
    icon: icons.glass,
    category: 'Haushaftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
  },
  {
    id: '4wzpdi',
    icon: icons.scales,
    category: 'Risikoleben',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4zlxckvj',
    icon: icons.scales,
    category: 'Sterbegeld',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4ouowai',
    icon: icons.scales,
    category: 'Schwere Krankheiten',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4awe',
    icon: icons.scales,
    category: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '4',
    icon: icons.scales,
    category: 'Hausratversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '5',
    icon: icons.phone,
    category: 'Handyversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6lajer',
    icon: icons.injury,
    category: 'Handy',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6',
    icon: icons.injury,
    category: 'Rechtsschutz',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.1',
    icon: icons.injury,
    category: 'Unfall',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.2',
    icon: icons.injury,
    category: 'Altervorsorge',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.3',
    icon: icons.injury,
    category: 'priv. Krankenversicherung',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '6.4',
    icon: icons.injury,
    category: 'Berufsunfahigkeit',
    state: State.pending,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '7i',
    icon: icons.wheel,
    category: 'Zahnzusatz',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: 'iolaiwer0',
    icon: icons.wheel,
    category: 'Glas',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '7ilakjwer',
    icon: icons.wheel,
    category: 'Handy',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '8i',
    icon: icons.injury,
    category: 'Tierhalterhaftpflicht',
    state: State.suggestion,
    dontDisplay: true,
    schabo: 0,
  },
  {
    id: '7',
    icon: icons.wheel,
    category: 'Risikoleben',
    state: State.suggestion,
    schabo: 0,
  },
  {
    id: 'olaiwer0',
    icon: icons.wheel,
    category: 'Sterbegeld',
    state: State.suggestion,
    schabo: 0,
  },
  {
    id: '7lakjwer',
    icon: icons.wheel,
    category: 'Hnady',
    state: State.suggestion,
    schabo: 0,
  },
  {
    id: '8',
    icon: icons.injury,
    category: 'Krankenversicherung',
    state: State.suggestion,
    schabo: 0,
  }
]

interface Props { }

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
      wheelSettings: wheelSettings
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

    return <div>
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
      <Switch>
        <Route path="/controls" children={() => <Link to='/'>hide controls</Link>}/>
        <Route path="/" children={() => <Link to='/controls'>show controls</Link>}/>
      </Switch>
      <Switch><Route path="/controls" children={() => <div>
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
          setWheelSettings={settings => this.setState({wheelSettings: settings})}
        />
      </div>
      }/></Switch>
    </div>
  }
}
