import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'
import {Text, Rect, Stage, Layer, Line} from 'react-konva'
import State from '../../constants/state'
import ColourPalette from '../../constants/colourPalette'
import ActionHome from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import * as style from './style.css'

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
  const getTemplate = ({state, icon}: {state: any, selected?: boolean, icon: string}) => {
    if (state === State.plus) {
      return {
        ...definitions.active,
        fill: '',
        image: loadImages && Boolean(icon) && {
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
      fill: w.id === 'plus' ? ColourPalette.activePlus : w.fill,
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

// const debug = (wheel: MotionArc[]): MotionArc[] => wheel.map(w => console.log(w.image) || w)
const debug = wheel => wheel

interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
  plusSelected: boolean,
}

interface State {
  center: any,
  previous: any,
  isPlusSelected: boolean,
  scale: number,
}

const getSchaboText = (businessWheel: BusinessArc[]) => <p><b style={{fontSize: '1.3em'}}>{businessWheel.reduce((accumulator, current) => accumulator + current.schabo, 0)} €</b> Schadensfreibonus</p>

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
  stage: any

  constructor() {
    super()
    this.state = {
      previous: null,
      center: null,
      isPlusSelected: false,
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

  cursor = cursorStyle => {
    this.stage.getStage().container().style.cursor = cursorStyle
  }

  renderPlusOptions = (showStroke) => {
    const upperRect = {
      x: wheelOrigin.x - (active.radius.outer/2),
      y: wheelOrigin.y - (active.radius.outer * Math.sqrt(3) / 2) + cdRadius.inner*0.7,
      width: active.radius.outer,
      height: (active.radius.outer*Math.sqrt(3)/2) - cdRadius.inner*2.2,
    }

    const bottomRect = {
      x:wheelOrigin.x - (active.radius.outer/2),
      y:wheelOrigin.y + cdRadius.inner*2.5,
      width:active.radius.outer,
      height:(active.radius.outer*Math.sqrt(3)/2) - cdRadius.inner*3,
    }

    const rightRect = {
      x: wheelOrigin.x + cdRadius.inner * 1.2,
      y: wheelOrigin.y - active.radius.outer / 6,
      height:active.radius.outer/3,
      width:(active.radius.outer*Math.sqrt(3)/2-cdRadius.inner/2),
    }

    return <Layer>
      <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
        {...upperRect}
      />
      <Text
        onMouseOver={() => this.cursor('pointer')}
        onMouseLeave={() => this.cursor('default')}
        fill='white'
        padding={20}
        fontSize={28}
        lineHeight={1.3}
        text='Bestehende Versicherung hinzufugen'
        align='center'
        {...upperRect}
      />
      <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
        {...bottomRect}
      />
      <Text
        onMouseOver={() => this.cursor('pointer')}
        onMouseLeave={() => this.cursor('default')}
        fill='white'
        padding={20}
        fontSize={28}
        lineHeight={1.3}
        text='Versicherungsbedarf ermitteln'
        align='center'
        {...bottomRect}
      />
      <Rect stroke={showStroke && 'white'} strokeWidth={2} listening={false}
        {...rightRect}
      />
      <Text
        onMouseOver={() => this.cursor('pointer')}
        onMouseLeave={() => this.cursor('default')}
        onClick={() => console.log('clicked right')}
        fill='white'
        padding={20}
        fontSize={28}
        lineHeight={1.2}
        text='Neue abschliesen'
        align='center'
        {...rightRect}
      />
      <Line stroke={ColourPalette.activePlus_backButton} lineCap='round' strokeWidth={5} points={
        [wheelOrigin.x + cdRadius.inner + 10, wheelOrigin.y - cdRadius.inner - 10,
         wheelOrigin.x + cdRadius.outer/1.7, wheelOrigin.y - cdRadius.outer/1.7]
      }/>
      <Line stroke={ColourPalette.activePlus_backButton} lineCap='round' strokeWidth={5} points={
        [wheelOrigin.x + cdRadius.inner + 10, wheelOrigin.y + cdRadius.inner + 10,
         wheelOrigin.x + cdRadius.outer/1.7, wheelOrigin.y + cdRadius.outer/1.7]
      }/>
    </Layer>
  }

  render () {
    const {plusSelected, wheel, animationPreset, select} = this.props
    const {center, scale} = this.state

    return <div className={style.stageContainer} style={{position: 'relative', width: `${wheelOrigin.x*2*scale}px`, height: `${wheelOrigin.y*2*this.state.scale}px`}}>
      <div className={style.centerContainer}>
        {center}
      </div>
      <Stage ref={r => {this.stage = r}} scaleX={scale} scaleY={scale} width={wheelOrigin.x*2*scale} height={wheelOrigin.y*2*scale}>
        <Wheel
          wheel={debug(goToCDStateOnSelect(firstShouldFillTheWheel(padSuggestions(toWheel(fromBusinessToMetal(wheel), -160), 10))))}
          animationPreset={animationPreset}
          arcClick={this.select}
          origin={wheelOrigin}
          colourPalette={ColourPalette}
        />
        {plusSelected && this.renderPlusOptions(false)}
      </Stage>
    </div>
  }
}
