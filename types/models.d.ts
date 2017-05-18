/** TodoMVC model definitions **/

declare interface TodoItemData {
  id?: TodoItemId;
  text?: string;
  completed?: boolean;
}

declare type TodoItemId = number;

declare type TodoFilterType = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';

declare type TodoStoreState = TodoItemData[];

declare interface ImageWithPromise {
  image: any,
  size: {height: number, width: number},
  loaded: Promise<void>
}

declare interface DonutRadius {
  inner: number,
  outer: number
}

declare interface Arc {
  angle: number,
  fill: string,
  radius: DonutRadius,
  id: string,
  opacity: number,
  padding: number,
  image?: any,
}

declare interface MotionArc extends Arc {
  rotation: number
}

declare interface AnimationPreset {
  stiffness: number,
  damping: number
}

declare interface BusinessArc {
  id: string,
  icon: string,
  text: string,
  state: string,
}
