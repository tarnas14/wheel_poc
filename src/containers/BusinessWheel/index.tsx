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

const fromBusinessToMetal = (businessWheel: BusinessArc[]): MotionArc[] => {
  const getTemplate = ({state, ...rest}) => {
    if (state === 'active') {
      return {
        rest,
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

  return businessWheel.map(businessArc => ({
    ...businessArc,
    opacity: 1,
    padding: 0,
    rotation: 0,
    ...getTemplate(businessArc)
  }))
}

export interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  centerText: string,
  select: (id: string) => void,
}

const toWheel = (wheel: MotionArc[], startRotation: number): MotionArc[] => wheel ? wheel.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: startRotation + sumAngles(allArcs) + allArcs.length/2
  }]
}, []) : []

const selectTransform = (wheel: MotionArc[]) : MotionArc[] => wheel.map(w => {
  if (w.selected) {
    return {
      ...w,
      angle: 360,
      rotation: -270,
      radius: {
        outer: active.radius.outer,
        inner: 50
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
      }
    }
  }

  return w
})

export default class extends React.Component<Props, {}> {

  render () {
    const {wheel, animationPreset, centerText, select} = this.props

    return <Wheel
      wheel={selectTransform(toWheel(fromBusinessToMetal(wheel), -126))}
      animationPreset={animationPreset}
      centerText={centerText}
      arcClick={select.bind(undefined)}
    />
  }
}
