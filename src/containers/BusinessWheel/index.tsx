import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find} from 'lodash'
import State from '../../constants/state'

import {displayed} from '../../util'

const sumAngles = arcs => displayed(arcs).reduce((angle, arc) => angle + arc.angle, 0)
const spaceTaken = arcs => displayed(arcs).length
  ? displayed(arcs).reduce((accumulator, arc) => ({
    sum: accumulator.sum + (arc.rotation - accumulator.lastFinish) + arc.angle + arc.padding,
    lastFinish: arc.rotation + arc.angle + arc.padding,
  }), {sum: 0, lastFinish: arcs[0].rotation}).sum
  : 0

const loadImages = true

const getImage = (src: string, overrides: any = {}): ImageWithPromise => {
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
    rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
    offsetScale: 1,
    offsetFromOutside: 20,
    textFontSize: 0,
    ...overrides,
  }
}

const fromBusinessToMetal = (businessWheel: BusinessArc[], wheelSettings: WheelSettings, colourPalette: any): GestaltArc[] => {

  const pending = {
    fill: colourPalette.pending,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.pendingRadius,
    },
  }

  const active = {
    fill: colourPalette.active,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.activeRadius,
    },
  }

  const suggestion = {
    fill: colourPalette.suggestion,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.suggestionRadius,
    }
  }

  const definitions = {
    pending,
    active,
    suggestion,
  }

  const getTemplate = ({state, icon, collapsed, dontDisplay}: {dontDisplay?: boolean, state: any, collapsed?: boolean, icon: string}) => {
    const bigIconSize = {width: 60, height: 60}
    const smallIconSize = {width: 42, height: 42}

    if (state === State.plus) {
      return {
        ...definitions.active,
        fill: colourPalette.activePlus,
        opacity: 0,
        image: loadImages && Boolean(icon) && getImage(icon, {
          size: bigIconSize,
          rotation: (arcRotation, arcAngle) => 90 + arcRotation + arcAngle / 2,
          offsetScale: 0.65,
        }),
      }
    }

    if (state === State.active) {
      if (dontDisplay) {
        return {
          ...definitions.active,
          angle: 0,
          padding: 0,
        }
      }

      if (collapsed) {
        return {
          ...definitions.active,
          angle: 5
        }
      }

      return {
        ...definitions.active,
        image: Boolean(icon) && getImage(icon, {size: bigIconSize}),
      }
    }

    if (state === State.pending) {
      if (dontDisplay) {
        return {
          ...definitions.pending,
          angle: 0,
          padding: 0,
        }
      }

      if (collapsed) {
        return {
          ...definitions.pending,
          angle: 5
        }
      }

      return {
        ...definitions.pending,
        image: Boolean(icon) && getImage(icon, {size: bigIconSize}),
      }
    }

    if (dontDisplay) {
      return {
        ...definitions.suggestion,
        angle: 0,
        padding: 0,
      }
    }

    return {
      ...definitions.suggestion,
      image: Boolean(icon) && getImage(icon, {size: smallIconSize}),
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

const toWheel = (referenceElementIndex: number, startRotation: number, wheel: GestaltArc[]): GestaltArc[] => wheel ? wheel.reduce((allArcs, currentArc, currentIndex) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: currentIndex < referenceElementIndex
      ? startRotation - sumAngles(wheel.slice(currentIndex, referenceElementIndex)) - displayed(wheel.slice(currentIndex, referenceElementIndex)).length/2
      : startRotation + sumAngles(wheel.slice(referenceElementIndex, currentIndex)) + displayed(wheel.slice(referenceElementIndex, currentIndex)).length/2
  }]
}, []) : []

const goToCDStateOnSelect = (wheel: GestaltArc[], cdRadius: DonutRadius, activeRadius: number) : GestaltArc[] => wheel.map(w => {
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
        outer: activeRadius,
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

const padSuggestions = (suggestionPadding: number, wheel: GestaltArc[]) : GestaltArc[] => [
  ...wheel.slice(0, wheel.findIndex(w => w.state === State.suggestion)),
  {
    ...wheel.find(w => w.state === State.suggestion),
    padding: suggestionPadding,
  },
  ...wheel.slice(wheel.findIndex(w => w.state === State.suggestion) + 1)
].map(w => w.state === State.suggestion ? {...w, rotation: w.rotation + suggestionPadding} : w)

const expandFirstElementTowardsTheLast = (wheel: GestaltArc[]): GestaltArc[] => {
  const originalAngle = wheel[0].angle
  const angleToFill = 360 - spaceTaken(wheel.slice(1)) - 1
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

const firstElementShouldNotBeSmallerThan = (minAngle: number, wheelReferenceIndex: number, startRotation: number, wheel: GestaltArc[]) : GestaltArc[] => {
  const takenSpace = spaceTaken(wheel.slice(1))
  const anglesOnly = sumAngles(wheel.slice(1))
  const spaceLeftInWheel = 360 - takenSpace
  if (spaceLeftInWheel >= minAngle) {
    return wheel
  }

  const missingAngle = minAngle - spaceLeftInWheel
  const angleScale = 1 - missingAngle/anglesOnly

  return toWheel(wheelReferenceIndex, startRotation, [
    {...wheel[0], angle: minAngle},
    ...wheel.slice(1).map(w => ({...w, angle: angleScale * w.angle}))
  ])
}

interface Props {
  wheelOrigin: {x: number, y: number},
  disabled: boolean,
  wheel: BusinessArc[],
  wheelSettings: WheelSettings,
  animationPreset: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
  colourPalette: any,
}

interface State { }

export default class extends React.Component<Props, State> {
  render () {
    const {wheelOrigin, colourPalette, wheel, disabled, animationPreset, select, wheelSettings} = this.props
    const {cdRadius} = wheelSettings

    const gestaltWheel = goToCDStateOnSelect(
      expandFirstElementTowardsTheLast(
      firstElementShouldNotBeSmallerThan(40, 1, -80,
        padSuggestions(5,
          toWheel(1, -80,
            fromBusinessToMetal(wheel, wheelSettings, colourPalette)
          )
        )
      ))
    , cdRadius, wheelSettings.activeRadius
    )

    return <Wheel
      disabled={disabled}
      wheel={gestaltWheel}
      animationPreset={animationPreset}
      arcClick={select}
      origin={wheelOrigin}
      colourPalette={colourPalette}
    />
  }
}
