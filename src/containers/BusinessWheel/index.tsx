import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'

const focusedAngle = angle => angle + 10
const selectedAngle = angle => angle * 2 + 10
const collapsedAngle = 3

const centerArea = {
  inner: 85,
  outer: 90
}

const pending = {
  fill: '#4b7f96',
  angle: 33,
  radius: {
    inner: centerArea.outer,
    outer: centerArea.outer + centerArea.inner * 2 * 1.15,
  },
}

const active = {
  fill: '#69b8d4',
  angle: 33,
  radius: {
    ...pending.radius,
    outer: pending.radius.outer * 1.15,
  },
}

const suggestion = {
  fill: '#34495e',
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

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0)

const getImage = (src: string): ImageWithPromise => {
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
  }
}

const fromBusinessToMetal = (businessWheel: BusinessArc[]): GestaltArc[] => {
  const getTemplate = ({state, icon}) => {
    if (state === 'active') {
      return {
        ...definitions.active,
        image: Boolean(icon) && getImage(icon),
      }
    }

    if (state === 'pending') {
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
    ...getTemplate(businessArc),
  }))
}

export interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  centerText: string,
  select: (id: string) => void,
}

const toWheel = (wheel: GestaltArc[], startRotation: number): GestaltArc[] => wheel ? wheel.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: startRotation + sumAngles(allArcs) + allArcs.length/2
  }]
}, []) : []

const selectTransform = (wheel: GestaltArc[]) : GestaltArc[] => wheel.map(w => {
  if (w.selected) {
    return {
      ...w,
      angle: 360,
      rotation: -270,
      radius: {
        outer: active.radius.outer,
        inner: 50
      },
      image: {
        ...w.image,
        rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
        size: {
          height: 1.5 * w.image.size.height,
          width: 1.5 * w.image.size.width
        },
        offsetScale: 0.65
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
        opacity: 0
      }
    }
  }

  return w
})

const padSuggestions = (wheel: GestaltArc[], suggestionPadding: number) : GestaltArc[] => [
  ...wheel.slice(0, wheel.findIndex(w => w.state === 'suggestion')),
  {
    ...wheel.find(w => w.state === 'suggestion'),
    padding: suggestionPadding,
  },
  ...wheel.slice(wheel.findIndex(w => w.state === 'suggestion') + 1)
].map(w => w.state === 'suggestion' ? {...w, rotation: w.rotation + suggestionPadding} : w)

// const debug = (wheel: MotionArc[]): MotionArc[] => wheel.map(w => console.log(w.image) || w)
const debug = wheel => wheel

export default class extends React.Component<Props, {}> {

  render () {
    const {wheel, animationPreset, centerText, select} = this.props

    return <Wheel
      wheel={debug(selectTransform(padSuggestions(toWheel(fromBusinessToMetal(wheel), -126), 10)))}
      animationPreset={animationPreset}
      centerText={centerText}
      arcClick={select.bind(undefined)}
    />
  }
}
