declare type ArcState = 'active' | 'pending' | 'suggestion' | 'plus'

declare interface DonutRadius {
  inner: number,
  outer: number
}

declare interface Dimensions {
    width: number,
    height: number
}

declare interface Icon {
    path: string,
    svgDimensions: Dimensions
}

declare interface MotionArc {
  angle: number,
  fill: string,
  radius: DonutRadius,
  id: string,
  opacity: number
  rotation: number,
  padding: number,
  raised: boolean,
  collapsed?: boolean,
  svg?: any
}

declare interface AnimationPreset {
  stiffness: number,
  damping: number
}

declare interface BusinessArc {
  id: string,
  icon: Icon,
  category: string,
  state: ArcState,
  schabo: number,
  selected?: boolean,
  nextAction?: () => void,
  dontDisplay?: boolean
}

declare interface Coords {
  x: number,
  y: number
}

declare interface Modifier {
  value: number,
  use: boolean
}

declare interface ShadowSettings {
  arc: {
    color?: string,
    blur: number,
    offset: {
      x: number,
      y: number
    },
    opacity: number,
    enabled: boolean,
    disableWhenSelected: boolean
  },
  shadowBelow: {
    modifiers: {
      height: Modifier,
      width: Modifier,
      blurRadius: Modifier,
      opacity: Modifier,
      distanceFromTheWheel: Modifier
    },
    def: {
      enabled: boolean,
      height: number,
      width: number,
      blurRadius: number,
      opacity: number,
      distanceFromTheWheel: number
    },
    selected: {
      enabled: boolean,
      height: number,
      width: number,
      blurRadius: number,
      opacity: number,
      distanceFromTheWheel: number
    }
  }
}

declare interface WheelSettings {
  start: {
    referenceElementIndex: number,
    startRotation: number
  },
  spacing: number,
  iconSizes: {
    big: Dimensions,
    small: Dimensions
  },
  plusMinSize: number,
  origin: Coords,
  centerArea: DonutRadius,
  angle: number,
  activeRadius: number,
  pendingRadius: number,
  suggestionPadding: number,
  suggestionRadius: number,
  cdRadius: DonutRadius,
  shadowSettings: ShadowSettings
}
