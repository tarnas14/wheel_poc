import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'

const sameAngle = 35
const focusedAngle = angle => angle + 10
const selectedAngle = angle => angle * 2 + 10
const collapsedAngle = 3

const centerArea = {
  inner: 85,
  outer: 90
}

const pending = {
  fill: '#34495e',
  angle: 35,
  radius: {
    inner: centerArea.outer,
    outer: centerArea.outer + centerArea.inner * 2 * 1.15,
  }
}

const active = {
  fill: '#00fff0',
  angle: 35,
  radius: {
    ...pending.radius,
    outer: pending.radius.outer * 1.15,
  }
}

const suggestion = {
  fill: '#34495e',
  angle: 35,
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

const getImage = (src, size, additional = {}): ImageWithPromise => {
  const img = new Image()
  img.src = src

  const loaded = new Promise<void>(resolve => {
    img.onload = () => resolve()
  })

  return {
    image: img,
    size: size,
    loaded: loaded,
    offsetScale: 0.9,
    ...additional
  }
}

const fromBusinessToMetal = businessWheel => {
  if (!businessWheel) {
    return {
      startRotation: 0,
      arcs: []
    }
  }

  const getTemplate = ({state, icon}) => {
    if (state === 'active') {
      return {
        ...definitions.active,
      }
    }

    if (state === 'pending') {
      return {
        ...definitions.pending
      }
    }

    return {
      ...definitions.suggestion
    }
  }

  const arcs = businessWheel.map(businessArc => ({
    id: businessArc.id,
    ...getTemplate(businessArc)
  }))

  return {
    startRotation: -126,
    arcs: [
      ...arcs,
    ]
  }
}

export interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  centerText: string,
}

const toWheel = (wheel): MotionArc[] => wheel ? wheel.arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: wheel.startRotation + sumAngles(allArcs) + allArcs.length/2
  }]
}, []) : []


export default class extends React.Component<Props, {}> {

  render () {
    const {wheel, animationPreset, centerText} = this.props

    return <Wheel
      wheel={toWheel(fromBusinessToMetal(wheel))}
      animationPreset={animationPreset}
      centerText={centerText}
    />
  }
}
