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

declare interface ImageWithPromise {
  image: any,
  size: {height: number, width: number},
  loaded: Promise<void>,
  rotation: (rotation: number, angle: number) => number,
  offsetScale: number,
  textFontSize: number,
}

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
  image?: any,
}

declare interface MotionArc extends Arc {
  rotation: number,
  padding: number,
  raised: boolean,
  text: string,
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
  collapsed?: boolean,
  hidden?: boolean,
  nextAction?: () => void,
}

declare interface GestaltArc extends MotionArc, BusinessArc {}

declare interface WheelSettings {
  centerArea: DonutRadius,
  angle: number,
  activeRadius: number,
  pendingRadius: number,
  suggestionPadding: number,
  suggestionRadius: number
}
