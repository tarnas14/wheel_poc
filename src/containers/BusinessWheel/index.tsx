import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'
import {Group, Circle, Stage, Layer} from 'react-konva'
import State from '../../constants/state'
import ColourPalette from '../../constants/colourPalette'
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import * as style from './style.css'

import PlusOptions from './PlusOptions'
import GoForwardButton from './GoForwardButton'
import SelectedSuggestionActions from './SelectedSuggestionActions'

const focusedAngle = angle => angle + 10
const selectedAngle = angle => angle * 2 + 10
const collapsedAngle = 3

const wheelOrigin = {
  x: 360,
  y: 360
}

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

const cdRadius = {
  inner: 50,
  outer: active.radius.outer
}

const definitions = {
  pending,
  active,
  suggestion,
}

const sumAngles = arcs => arcs.reduce((angle, arc) => angle + arc.angle + arc.padding, 0)

const loadImages = true

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
  const getTemplate = ({state, icon, collapsed}: {state: any, collapsed?: boolean, icon: string}) => {
    if (state === State.plus) {
      return {
        ...definitions.active,
        fill: ColourPalette.activePlus,
        opacity: 0,
        image: loadImages && Boolean(icon) && {
          ...getImage(icon),
          rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
          offsetScale: 0.65,
        },
      }
    }

    if (state === State.active) {
      if (collapsed) {
        return {
          ...definitions.active,
          angle: 5
        }
      }

      return {
        ...definitions.active,
        image: Boolean(icon) && getImage(icon),
      }
    }

    if (state === State.pending) {
      if (collapsed) {
        return {
          ...definitions.pending,
          angle: 5
        }
      }

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

const toWheel = (wheel: GestaltArc[], referenceElementIndex: number, startRotation: number): GestaltArc[] => wheel ? wheel.reduce((allArcs, currentArc, currentIndex) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: currentIndex < referenceElementIndex
      ? startRotation - sumAngles(wheel.slice(currentIndex, referenceElementIndex)) - wheel.slice(currentIndex, referenceElementIndex).length/2
      : startRotation + sumAngles(wheel.slice(referenceElementIndex, currentIndex)) + wheel.slice(referenceElementIndex, currentIndex).length/2
  }]
}, []) : []

const goToCDStateOnSelect = (wheel: GestaltArc[]) : GestaltArc[] => wheel.map(w => {
  if (w.selected) {
    return {
      ...w,
      angle: 380,
      rotation: -280,
      opacity: 1,
      radius: {
        outer: cdRadius.outer,
        inner: cdRadius.inner
      },
      image: w.image && {
        ...w.image,
        rotation: w.id === 'plus'
          ? (arcRotation, arcAngle) => -90
          : (arcRotation, arcAngle) => -0,
        size: {
          height: 1.5 * w.image.size.height,
          width: 1.5 * w.image.size.width
        },
        offsetScale: 0.65,
        textFontSize: 35,
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

// const motionDebug = (wheel: MotionArc[]): MotionArc[] => wheel.map(w => console.log(w.collapsed) || w)
const motionDebug = wheel => wheel

interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
}

interface State {
  previous: any,
  scale: number,
}

const getSchaboText = (businessWheel: BusinessArc[]) => <p><b style={{fontSize: '1.3em'}}>{businessWheel.reduce((accumulator, current) => accumulator + current.schabo, 0)} €</b> Schadensfreibonus</p>

const expandFirstElementTowardsTheLast = (wheel: GestaltArc[]): GestaltArc[] => {
  const originalAngle = wheel[0].angle
  const angleToFill = 360 - sumAngles(wheel.slice(1)) - wheel.length
  const rotationOffset = angleToFill - originalAngle
  return [
    {
      ...wheel[0],
      angle: angleToFill,
      rotation: wheel[0].rotation - rotationOffset
    },
    ...wheel.slice(1)
  ]
}

const plusSelected = (wheel: BusinessArc[]): boolean => Boolean(wheel.filter(w => w.state === State.plus && w.selected).length)

export default class extends React.Component<Props, State> {
  stage: any

  constructor() {
    super()
    this.state = {
      previous: null,
      scale: 1,
    }
  }

  componentDidMount () {
    const updateScale = () => {
      const innerWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width)
      const containerWidth = innerWidth > wheelOrigin.x * 2 ? wheelOrigin.x * 2 : innerWidth
      const widthScale = containerWidth / (wheelOrigin.x * 2)

      const innerHeight = (screen.height)
      const containerHeight = innerHeight > wheelOrigin.y * 2 ? wheelOrigin.y * 2 : innerHeight
      const heightScale = containerHeight / (wheelOrigin.y * 2)

      const scale = Math.min(widthScale, heightScale)

      this.setState({scale})
    }

    updateScale()
    window.onresize = updateScale
  }

  preventMultiple = (id: string) => {
    const {selected} = this.props.wheel.find(w => w.id === id)

    if (!selected) {
      this.props.select(id)
    }
  }

  renderBackButton = (colour: string) => {
    return <ArrowLeft
      style={{height: 'auto', width: 'auto', color: colour, cursor: 'pointer'}}
      onClick={this.clearSelection}
    />
  }

  select = (id: string) => this.preventMultiple(id)

  clearSelection = () => {
    this.props.clearSelection()
  }

  cursor = cursorStyle => {
    this.stage.getStage().container().style.cursor = cursorStyle
  }

  renderCenter () {
    const {wheel} = this.props
    const selected = wheel.find(w => w.selected)
    if (!selected) {
      return getSchaboText(wheel)
    }

    return this.renderBackButton(selected.id === 'plus' ? ColourPalette.activePlus_backButton : ColourPalette.active)
  }

  render () {
    const {wheel, animationPreset, select} = this.props
    const {scale} = this.state

    const gestaltWheel = motionDebug(goToCDStateOnSelect(expandFirstElementTowardsTheLast(padSuggestions(toWheel(fromBusinessToMetal(wheel), 1, -80), 10))))

    return <div className={style.stageContainer} style={{position: 'relative', width: `${wheelOrigin.x*2*scale}px`, height: `${wheelOrigin.y*2*this.state.scale}px`}}>
      <div className={style.centerContainer}>
        {this.renderCenter()}
      </div>
      <Stage ref={r => {this.stage = r}} scaleX={scale} scaleY={scale} width={wheelOrigin.x*2*scale} height={wheelOrigin.y*2*scale}>
        <Wheel
          wheel={gestaltWheel}
          animationPreset={animationPreset}
          arcClick={this.select}
          origin={wheelOrigin}
          colourPalette={ColourPalette}
        />
        {plusSelected(wheel) && <PlusOptions
          colourPalette={ColourPalette}
          showStroke={false}
          wheelOrigin={wheelOrigin}
          activeRadius={active.radius}
          cdRadius={cdRadius}
          setCursor={this.cursor}
          addExistingInsurance={() => console.log('Bestehende Versicherung hinzufugen')}
          lockNewInsurance={() => console.log('Neue abschliesen')}
          checkRequirements={() => console.log('Versicherungsbedarf ermitteln')}
        />}
        <SelectedSuggestionActions
          suggestion={wheel.find(w => Boolean(w.selected && w.state === State.suggestion))}
          setCursor={this.cursor}
          addExisting={id => console.log('adding existing to/with', id)}
          lockNew={id => console.log('doing something with new insurance', id)}
          colourPalette={ColourPalette.suggestionActions}
          wheelOrigin={wheelOrigin}
          cdRadius={cdRadius}
          activeRadius={active.radius}
        />
      </Stage>
      <GoForwardButton
        wheel={gestaltWheel}
        wheelOrigin={wheelOrigin}
        cdRadius={cdRadius}
        activeRadius={active.radius}
        colourPalette={ColourPalette}
        scale={scale}
      />
    </div>
  }
}
