import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'
import State from '../../constants/state'
import ColourPalette from '../../constants/colourPalette'
import ActionHome from 'material-ui/svg-icons/hardware/keyboard-arrow-left'

const focusedAngle = angle => angle + 10
const selectedAngle = angle => angle * 2 + 10
const collapsedAngle = 3

const centerArea = {
  inner: 85,
  outer: 90
}

const pending = {
  fill: ColourPalette.pending,
  angle: 33,
  radius: {
    inner: centerArea.outer,
    outer: centerArea.outer + centerArea.inner * 2 * 1.15,
  },
}

const active = {
  fill: ColourPalette.active,
  angle: 33,
  radius: {
    ...pending.radius,
    outer: pending.radius.outer * 1.15,
  },
}

const suggestion = {
  fill: ColourPalette.suggestion,
  angle: 33,
  radius: {
    ...pending.radius,
    outer: pending.radius.outer * 0.85
  }
}

const definitions = {
  pending,
  active,
  suggestion,
}

const sumAngles = arcs => arcs.reduce((angle, arc) => angle + arc.angle + arc.padding, 0)

const loadImages = false

const getImage = (src: string): ImageWithPromise => {
  if (!loadImages) {
    return undefined
  }
  const img = new Image()
  img.src = src

  const loaded = new Promise<void>(resolve => {
    img.onload = () => resolve()
  })

  return {
    image: img,
    size: {
      width: 40,
      height: 40
    },
    loaded: loaded,
    rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 4,
    offsetScale: 0.96,
    textFontSize: 0,
  }
}


const fromBusinessToMetal = (businessWheel: BusinessArc[]): GestaltArc[] => {
  const getTemplate = ({state, selected, icon}: {state: any, selected?: boolean, icon: string}) => {
    if (state === State.plus) {
      return {
        ...definitions.active,
        fill: selected ? ColourPalette.activePlus : '',
        image: Boolean(icon) && {
          ...getImage(icon),
          rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
          offsetScale: 0.65,
        },
      }
    }

    if (state === State.active) {
      return {
        ...definitions.active,
        image: Boolean(icon) && getImage(icon),
      }
    }

    if (state === State.pending) {
      return {
        ...definitions.pending,
        image: Boolean(icon) && getImage(icon),
      }
    }

    return {
      ...definitions.suggestion,
      image: Boolean(icon) && getImage(icon),
    }
  }

  return businessWheel.map(businessArc => ({
    ...businessArc,
    opacity: 1,
    padding: 0,
    rotation: 0,
    raised: Boolean(businessArc.schabo),
    ...getTemplate(businessArc),
  }))
}

const toWheel = (wheel: GestaltArc[], startRotation: number): GestaltArc[] => wheel ? wheel.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: startRotation + sumAngles(allArcs) + allArcs.length/2
  }]
}, []) : []

const goToCDStateOnSelect = (wheel: GestaltArc[]) : GestaltArc[] => wheel.map(w => {
  if (w.selected) {
    return {
      ...w,
      angle: 380,
      rotation: -280,
      radius: {
        outer: active.radius.outer,
        inner: 50
      },
      image: w.image && {
        ...w.image,
        rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
        size: {
          height: 1.5 * w.image.size.height,
          width: 1.5 * w.image.size.width
        },
        offsetScale: 0.65,
        textFontSize: 20,
      }
    }
  }

  if (w.hidden) {
    return {
      ...w,
      angle: 0,
      rotation: -270,
      opacity: 0,
      radius: {
        outer: active.radius.outer,
        inner: 50
      },
      image: w.image && {
        ...w.image,
        size: {
          height: 1,
          width: 1,
        },
        opacity: 0,
        textFontSize: 0,
      }
    }
  }

  return w
})

const padSuggestions = (wheel: GestaltArc[], suggestionPadding: number) : GestaltArc[] => [
  ...wheel.slice(0, wheel.findIndex(w => w.state === State.suggestion)),
  {
    ...wheel.find(w => w.state === State.suggestion),
    padding: suggestionPadding,
  },
  ...wheel.slice(wheel.findIndex(w => w.state === State.suggestion) + 1)
].map(w => w.state === State.suggestion ? {...w, rotation: w.rotation + suggestionPadding} : w)

// const debug = (wheel: MotionArc[]): MotionArc[] => wheel.map(w => console.log(w.image) || w)
const debug = wheel => wheel

interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
}

interface State {
  center: any,
  previous: any,
  isPlusSelected: boolean,
}

const getSchaboText = (businessWheel: BusinessArc[]) => <span><b style={{fontSize: '1.4em'}}>{businessWheel.reduce((accumulator, current) => accumulator + current.schabo, 0)} €</b> Schadensfreibonus</span>

const plusSelected = (wheel: GestaltArc[], selected: boolean): GestaltArc[] => selected
  ? wheel.map(w => w.id === 'plus'
    ? {
      ...w,
      rotation: -280,
      angle: 380
    }
    : {
      ...w,
      rotation: -280,
      angle: 0
    }
  )
  : wheel

const firstShouldFillTheWheel = (wheel: GestaltArc[]): GestaltArc[] => {
  const originalAngle = wheel[0].angle
  const angleToFill = 360 - sumAngles(wheel.slice(1)) - wheel.length
  const rotationOffset = angleToFill - originalAngle
  return [
    {
      ...wheel[0],
      angle: angleToFill
    },
    ...wheel.slice(1).map(w => ({...w, rotation: w.rotation + rotationOffset}))
  ]
}

export default class extends React.Component<Props, State> {

  constructor() {
    super()
    this.state = {
      previous: null,
      center: null,
      isPlusSelected: false,
    }
  }

  componentDidMount () {
    const {wheel} = this.props
    this.setState({
      center: getSchaboText(wheel)
    })
  }

  preventMultiple = (id: string) => {
    const {selected} = this.props.wheel.find(w => w.id === id)

    if (!selected) {
      this.showBackButton(id === 'plus' ? ColourPalette.activePlus_backButton : ColourPalette.active)
      this.props.select(id)
    }
  }

  showBackButton = (colour: string) => {
    this.setCenter(<ActionHome
      style={{height: 'auto', width: 'auto', color: colour}}
      onClick={this.clearSelection}
    />)
  }

  select = (id: string) => this.preventMultiple(id)

  setCenter = (center: any) => {
    this.setState(s => ({
      previous: s.center,
      center: center
    }))
  }

  setPreviousCenter = () => {
    this.setState(s => ({
      previous: s.center,
      center: s.previous
    }))
  }

  clearSelection = () => {
    this.setPreviousCenter()
    this.props.clearSelection()
  }

  render () {
    const {wheel, animationPreset, select} = this.props

    return <Wheel
      wheel={debug(goToCDStateOnSelect(firstShouldFillTheWheel(padSuggestions(toWheel(fromBusinessToMetal(wheel), -160), 10))))}
      animationPreset={animationPreset}
      center={this.state.center}
      arcClick={this.select}
      colourPalette={ColourPalette}
    />
  }
}
