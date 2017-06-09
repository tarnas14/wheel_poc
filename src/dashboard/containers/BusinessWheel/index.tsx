import * as React from 'react'
import {Wheel} from '../../components/Wheel'
import {find, findIndex} from 'lodash'
import '../../types/models'
import StateEnum from '../../constants/state'

import {displayed} from '../../util'

interface GestaltArc extends MotionArc, BusinessArc {}

const sumAngles = (arcs: any[]) => displayed(arcs).reduce((angle: number, arc: any) => angle + arc.angle, 0)
const spaceTaken = (arcs: any[]) => displayed(arcs).length
  ? displayed(arcs).reduce((accumulator: any, arc: {rotation: number, angle: number, padding: number}) => ({
    sum: accumulator.sum + (arc.rotation - accumulator.lastFinish) + arc.angle + arc.padding,
    lastFinish: arc.rotation + arc.angle + arc.padding
  }), {sum: 0, lastFinish: arcs[0].rotation}).sum
  : 0

const getImage = (icon: Icon, overrides: any = {size: {x: 0, y: 0}}) => ({
  path: icon.path,
  fill: 'white',
  scale: {x: overrides.size.width / icon.svgDimensions.width, y: overrides.size.height / icon.svgDimensions.height},
  rotation: (arcRotation: number, arcAngle: number) => 90 + arcRotation + arcAngle / 2,
  offsetFromOutside: 20,
  offsetScale: 1,
  ...overrides
})

const fromBusinessToMetal = (businessWheel: BusinessArc[], wheelSettings: WheelSettings, colourPalette: any): GestaltArc[] => {

  const pending = {
    fill: colourPalette.pending,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.pendingRadius
    }
  }

  const active = {
    fill: colourPalette.active,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.activeRadius
    }
  }

  const suggestion = {
    fill: colourPalette.suggestion,
    angle: wheelSettings.angle,
    radius: {
      inner: wheelSettings.centerArea.outer,
      outer: wheelSettings.suggestionRadius
    }
  }

  const definitions = {
    pending,
    active,
    suggestion
  }

  const getTemplate = ({state, icon, collapsed, dontDisplay}: {dontDisplay?: boolean, state: any, collapsed?: boolean, icon: Icon}) => {
    const bigIconSize = wheelSettings.iconSizes.big
    const smallIconSize = wheelSettings.iconSizes.small

    if (state === StateEnum.plus) {
      return {
        ...definitions.active,
        fill: colourPalette.raised,
        opacity: 0,
        svg: {
          path: icon.path,
          fill: colourPalette.raised,
          scale: {x: bigIconSize.width / 81, y: bigIconSize.height / 81},
          size: bigIconSize,
          rotation: (arcRotation: number, arcAngle: number) => 90 + arcRotation + arcAngle / 2,
          offsetFromOutside: 20,
          offsetScale: 0.5
        }
      }
    }

    if (state === StateEnum.active) {
      if (dontDisplay) {
        return {
          ...definitions.active,
          angle: 0,
          padding: 0
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
        svg: getImage(icon, {size: bigIconSize})
      }
    }

    if (state === StateEnum.pending) {
      if (dontDisplay) {
        return {
          ...definitions.pending,
          angle: 0,
          padding: 0
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
        svg: getImage(icon, {size: bigIconSize})
      }
    }

    if (dontDisplay) {
      return {
        ...definitions.suggestion,
        angle: 0,
        padding: 0
      }
    }

    return {
      ...definitions.suggestion,
      svg: getImage(icon, {size: smallIconSize})
    }
  }

  return businessWheel.map(businessArc => ({
    ...businessArc,
    opacity: 1,
    padding: 0,
    rotation: 0,
    raised: Boolean(businessArc.schabo),
    ...getTemplate(businessArc)
  }))
}

const makeWheel = (startRotation: number) => (wheel: GestaltArc[]) => wheel.length
  ? wheel.reduce((accumulator, currentArc) => [
    ...accumulator,
    {
      ...currentArc,
      rotation: startRotation + sumAngles(accumulator) + displayed(accumulator).length / 2
    }
  ], [])
  : []

interface WheelStartSettings {referenceElementIndex: number, startRotation: number};
const toWheel = ({referenceElementIndex, startRotation}: WheelStartSettings) => (wheel: GestaltArc[]): GestaltArc[] => wheel
    ? wheel.reduce((allArcs, currentArc, currentIndex) => {
      return [...allArcs, {
        ...currentArc,
        rotation: currentIndex < referenceElementIndex
          ? startRotation
            - sumAngles(wheel.slice(currentIndex, referenceElementIndex))
            - displayed(wheel.slice(currentIndex, referenceElementIndex)).length / 2
          : startRotation
            + sumAngles(wheel.slice(referenceElementIndex, currentIndex))
            + displayed(wheel.slice(referenceElementIndex, currentIndex)).length / 2
      }]
    }, [])
    : []

const goToCDStateOnSelect = (cdRadius: DonutRadius, activeRadius: number) => (wheel: GestaltArc[]) : GestaltArc[] =>
    wheel.filter(w => w.selected).length === 0
        ? wheel
        : wheel.map(w => {
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
              svg: w.svg && {
                ...w.svg,
                scale: w.id === 'plus'
                  ? {x: 0.01, y: 0.01}
                  : {
                    x: w.svg.scale.x * 1.5,
                    y: w.svg.scale.y * 1.5
                  },
                rotation: w.id === 'plus'
                  ? () => -90
                  : () => -0,
                size: {
                  height: 1.5 * w.svg.size.height,
                  width: 1.5 * w.svg.size.width
                },
                offsetScale: 0.65
              }
            }
          }

          return {
            ...w,
            angle: 0,
            rotation: -270,
            opacity: 0,
            radius: {
              outer: activeRadius,
              inner: 50
            },
            svg: w.svg && {
              ...w.svg,
              scale: {
                x: 0.01,
                y: 0.01
              },
              size: {
                height: 1,
                width: 1
              },
              opacity: 0
            }
          }
        })

const padSuggestions = (suggestionPadding: number) => (wheel: GestaltArc[]) : GestaltArc[] => [
  ...wheel.slice(0, findIndex(wheel, w => w.state === StateEnum.suggestion)),
  {
    ...find(wheel, w => w.state === StateEnum.suggestion),
    padding: suggestionPadding
  },
  ...wheel.slice(findIndex(wheel, w => w.state === StateEnum.suggestion) + 1)
].map(w => w.state === StateEnum.suggestion ? {...w, rotation: w.rotation + suggestionPadding} : w)

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

const scaleElementsDownToReserveSpaceForFirst = (minAngle: number, wheelStart: WheelStartSettings) => (wheel: GestaltArc[]) : GestaltArc[] => {
  const takenSpace = spaceTaken(wheel.slice(1))
  const anglesOnly = sumAngles(wheel.slice(1))
  const spaceLeftInWheel = 360 - takenSpace
  if (spaceLeftInWheel >= minAngle) {
    return wheel
  }

  const missingAngle = minAngle - spaceLeftInWheel
  const angleScale = 1 - missingAngle / anglesOnly

  return toWheel(wheelStart)([
    {...wheel[0], angle: minAngle},
    ...wheel.slice(1).map(w => ({...w, angle: angleScale * w.angle}))
  ])
}

const chain = (initialValue: GestaltArc[]) =>
    (transformations: ((a: GestaltArc[]) => GestaltArc[])[]) =>
        transformations.reduceRight((accumulator, currentTransform) => currentTransform(accumulator), initialValue)

const skipFirst = (transformation: (a: GestaltArc[]) => GestaltArc[]) => (wheel: GestaltArc[]) => [
  wheel[0],
  ...transformation(wheel.slice(1))
]

const collapse = (w: GestaltArc) => ({...w, collapsed: true, angle: 5, svg: undefined} as GestaltArc)

const collapseFromEnd = (toCollapse: number) => (wheel: GestaltArc[]) => [
  ...wheel.slice(0, -toCollapse),
  ...wheel.slice(-toCollapse).map(collapse)
]

const collapseFromStart = (toCollapse: number) => (wheel: GestaltArc[]) => wheel.reduce((accumulator, current) => {
  if (current.dontDisplay || accumulator.counter >= toCollapse) {
    return {
      ...accumulator,
      collapsed: [...accumulator.collapsed, current]
    }
  }

  return {
    collapsed: [...accumulator.collapsed, collapse(current)],
    counter: accumulator.counter + 1
  }
}, {collapsed: [], counter: 0}).collapsed

const limitAngleByCollapsing = (collapseState: any[], maxAngle: number, minUncollapsedElements: number, state: ArcState) => (wheel: GestaltArc[]) => {
  const groupCollapsePredicate = (w: GestaltArc) => w.state === state
  const currentAngle = spaceTaken(wheel)

  if (currentAngle <= maxAngle) {
    return wheel
  }

  const groupToCollapse = wheel.filter(groupCollapsePredicate)
  const notCollapsed = displayed(groupToCollapse).length

  if (notCollapsed <= minUncollapsedElements) {
    return wheel
  }

  const notCollapsedAngle = displayed(wheel).find((w: GestaltArc) => groupCollapsePredicate(w) && !w.collapsed).angle
  const collapsedAngle = 5
  const shouldCollapseCount = Math.min(
    Math.ceil((currentAngle - maxAngle) / (notCollapsedAngle - collapsedAngle)),
    displayed(groupToCollapse).length - minUncollapsedElements
  )
  const firstGroupIndex = wheel.indexOf(groupToCollapse[0])
  const collapseFunc = collapseState[state] ? collapseFromStart(shouldCollapseCount) : collapseFromEnd(shouldCollapseCount)

  return makeWheel(-80)([
    ...wheel.slice(0, firstGroupIndex),
    ...collapseFunc(groupToCollapse),
    ...wheel.slice(firstGroupIndex + groupToCollapse.length)
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

interface State {
  collapse: any
}

export default class extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      collapse: {}
    }
  }

  handleClick = (id: string, collapsed: boolean) => {
    if (!collapsed) {
      this.props.select(id)
      return
    }

    const state = find(this.props.wheel, w => w.id === id).state
    this.setState(s => ({
      collapse: {
        ...s.collapse,
        [state]: !Boolean(s.collapse[state])
      }
    }))
  }

  render () {
    const {wheelOrigin, colourPalette, wheel, disabled, animationPreset, wheelSettings} = this.props
    const {cdRadius} = wheelSettings
    const {collapse} = this.state

    const showAngles = () => (wheel: GestaltArc[]) => wheel// console.log(spaceTaken(wheel.slice(1))) || wheel

    const transformations = [
      goToCDStateOnSelect(cdRadius, wheelSettings.activeRadius),
      expandFirstElementTowardsTheLast,
      showAngles(),
      scaleElementsDownToReserveSpaceForFirst(wheelSettings.plusMinSize, wheelSettings.start),
      skipFirst(limitAngleByCollapsing(collapse, 320, 4, StateEnum.active)),
      skipFirst(limitAngleByCollapsing(collapse, 320, 3, StateEnum.pending)),
      padSuggestions(5),
      toWheel(wheelSettings.start)
    ]

    const gestaltWheel = chain(fromBusinessToMetal(wheel, wheelSettings, colourPalette))(transformations)

    return <Wheel
      disabled={disabled}
      wheel={gestaltWheel}
      animationPreset={animationPreset}
      arcClick={this.handleClick}
      origin={wheelOrigin}
      colourPalette={colourPalette}
    />
  }
}
