/** TodoMVC model definitions **/

declare interface TodoItemData {
  id?: TodoItemId
  text?: string
  completed?: boolean
}

declare type TodoItemId = number

declare type TodoFilterType = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED'

declare type TodoStoreState = TodoItemData[]

declare type State = 'active' | 'pending' | 'suggestion' | 'plus'

declare interface DonutRadius {
  inner: number,
  outer: number,
}

declare interface Arc {
  angle: number,
  fill: string,
  radius: DonutRadius,
  id: string,
  opacity: number,
}

declare interface MotionArc extends Arc {
  rotation: number,
  padding: number,
  raised: boolean,
  text: string,
  collapsed?: boolean,
  svg?: any,
}

declare interface AnimationPreset {
  stiffness: number,
  damping: number,
}

declare interface BusinessArc {
  id: string,
  icon: string,
  text: string,
  state: State,
  schabo: number,
  selected?: boolean,
  hidden?: boolean,
  nextAction?: () => void,
  dontDisplay?: boolean,
}

declare interface GestaltArc extends MotionArc, BusinessArc {}

declare interface Coords {
  x: number,
  y: number,
}

declare interface WheelSettings {
  start: {
    referenceElementIndex: number,
    startRotation: number,
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
}
