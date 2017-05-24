import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import {Image as KonvaImage, Group, Layer, Stage, Arc} from 'react-konva'
import {TransitionMotion, Motion, spring, presets} from 'react-motion'
import BusinessWheel from '../BusinessWheel'
import * as style from './style.css'
import State from '../../constants/state'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ColourPalette from '../../constants/colourPalette'

const icons = {
  home: 'https://api.icons8.com/download/4662d6548b0042ab2fa5afe9429d21d7309b1559/windows10/PNG/256/Very_Basic/home-256.png',
  glass: 'https://d30y9cdsu7xlg0.cloudfront.net/png/86210-200.png',
  paw: 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons-256/magic-marker-icons-animals/114688-magic-marker-icon-animals-animal-cat-print.png',
  phone: 'https://img.clipartfest.com/7a81181007424edbd234a5cefaf90e90_cell-phone-clipart-with-transparent-background-clipartfest-cell-phone-clipart-transparent_512-512.png',
  scales: 'https://d30y9cdsu7xlg0.cloudfront.net/png/331-200.png',
  wheel: 'http://www.tireworksmb.com/wp-content/uploads/2015/10/tire-icon.png',
  injury: 'https://d30y9cdsu7xlg0.cloudfront.net/png/191712-200.png',
  plus: 'http://www.clker.com/cliparts/L/q/T/i/P/S/add-button-white-hi.png',
}

const debug = (wheel: BusinessArc[]) : BusinessArc[] => console.log(wheel) || wheel.map(w => console.log(w.collapsed) || w)

const collapse = (wheel: BusinessArc[], maxUncollapsedElements) : BusinessArc[] => {
  const collapseGroup = (wheel: BusinessArc[], groupPredicate: (w: BusinessArc) => Boolean): BusinessArc[] => {
    const group = wheel.filter(groupPredicate)
    if (group.length <= maxUncollapsedElements) {
      return wheel
    }

    const firstGroupIndex = wheel.indexOf(group[0])
    const toCollapse = group.length - maxUncollapsedElements

    return [
      ...wheel.slice(0, firstGroupIndex + maxUncollapsedElements),
      ...wheel.slice(firstGroupIndex + maxUncollapsedElements, firstGroupIndex + maxUncollapsedElements + toCollapse).map(w => ({...w, collapsed: true})),
      ...wheel.slice(firstGroupIndex + maxUncollapsedElements + toCollapse)
    ]
  }

  return collapseGroup(collapseGroup(wheel, w => w.state === State.pending), w => w.state === State.active)
}

const businessWheel: BusinessArc[] = [
  // {
    // id: '-2',
    // icon: icons.home,
    // text: 'collapsed -2',
    // state: 'active',
  // },
  {
    id: 'plus',
    icon: icons.plus,
    text: '',
    state: State.plus,
    schabo: 0,
  },
  // {
    // id: '-1',
    // icon: icons.home,
    // text: 'collapsed -1',
    // state: State.active,
    // schabo: 0,
  // },
  {
    id: '0',
    icon: icons.glass,
    text: 'collapsed 0',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('collapsed 0'),
  },
  {
    id: '1',
    icon: icons.home,
    text: 'Hausrat',
    state: State.active,
    schabo: 13,
    nextAction: () => console.log('hausrat'),
  },
  {
    id: 'glass',
    icon: icons.glass,
    text: 'Privat Haftpflicht',
    state: State.active,
    schabo: 0,
    nextAction: () => console.log('privat haftpflicht'),
  },
  {
    id: '3',
    icon: icons.paw,
    text: 'Tierhalterhaftpflicht',
    state: State.active,
    schabo: 10.75,
    nextAction: () => console.log('tierhalterhaftpflicht'),
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
  // {
    // id: '6.1',
    // icon: icons.injury,
    // text: '',
    // state: State.pending,
    // schabo: 0,
  // },
  {
    id: '6.2',
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

const toggleCollapsed = (wheel: BusinessArc[], collapsed: BusinessArc) : BusinessArc[] => {
  const collapseEnd = (toToggle, numberOfCollapsed) => [
    ...toToggle.slice(0, -numberOfCollapsed),
    ...toToggle.slice(-numberOfCollapsed).map(w => ({...w, collapsed: true}))
  ]

  const collapseBeginning = (toToggle, numberOfCollapsed) => [
    ...toToggle.slice(0, numberOfCollapsed).map(w => ({...w, collapsed: true})),
    ...toToggle.slice(-numberOfCollapsed)
  ]

  const sameStateAsCollapsed = w => w.state === collapsed.state
  const firstOfTheSameState = wheel.find(sameStateAsCollapsed)
  const firstIndexOfTheSameState = wheel.indexOf(firstOfTheSameState)
  const numberOfCollapsed = wheel.filter(w => w.collapsed && sameStateAsCollapsed(w)).length

  const toToggle = wheel.filter(sameStateAsCollapsed).map(w => ({...w, collapsed: undefined}))
  const toggled = firstOfTheSameState.collapsed
    ? collapseEnd(toToggle, numberOfCollapsed)
    : collapseBeginning(toToggle, numberOfCollapsed)

  return [
    ...wheel.slice(0, firstIndexOfTheSameState),
    ...toggled,
    ...wheel.slice(firstIndexOfTheSameState + toggled.length)
  ]
}

const onEnter = callback => e => e.keyCode === 13
  ? callback(e)
  : undefined

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> { }

  export interface State {
    wheel: BusinessArc[],
    animationPreset: string,
    animationSetting: AnimationPreset,
    wheelSettings: WheelSettings,
  }
}

export class Dashboard extends React.Component<Dashboard.Props, Dashboard.State> {
  constructor() {
    super()
    this.state = {
      wheel: collapse(businessWheel, 2),
      animationPreset: 'noWobble',
      animationSetting: presets.noWobble,
      wheelSettings: {
        centerArea: {
          inner: 175/2, // not used
          outer: 175/2,
        },
        angle: 40,
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
    const toSelect = this.state.wheel.find(w => w.id === id)

    if (toSelect.collapsed) {
      this.setState(s => ({
        wheel: toggleCollapsed(s.wheel, toSelect)
      }))
      return
    }

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

  render () {
    const {animationSetting: {stiffness, damping}, wheelSettings} = this.state
    return <MuiThemeProvider><div>
      <hr className={style.divider}/>

      <BusinessWheel
        wheel={this.state.wheel}
        wheelSettings={wheelSettings}
        colourPalette={ColourPalette}
        animationPreset={this.state.animationSetting}
        select={this.select}
        clearSelection={this.clearSelection}
      />
      <div>
        <div style={{display: 'inline-block'}}>
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
        <div style={{display: 'inline-block'}}>
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
            <input type="number" defaultValue={wheelSettings.centerArea.outer * 2}
              onKeyDown={onEnter(e => {
                const value = Number(e.currentTarget.value)/2
                this.setState(s => ({wheelSettings: {...s.wheelSettings, centerArea: {outer: value}}}))
              })}
            />
          </p>
        </div>
      </div>
    </div></MuiThemeProvider>
  }
}
