import * as React from 'react';
import {CleanWheel} from '../../components/CleanWheel';
import {find} from 'lodash';

const sameAngle = 35;
const focusedAngle = sameAngle + 10;
const selectedAngle = sameAngle * 2 + 10;

const sumAngles = arcs => arcs.reduce((angle, arc) => angle += arc.angle, 0);

const centerWheel = {
  opacity: 0.5,
  fill: '#95a5a6',
  radius: {
    inner: 85,
    outer: 90
  }
};

const middleRadius = {
  inner: centerWheel.radius.inner,
  outer: centerWheel.radius.outer + (centerWheel.radius.inner * 2 * 1.15)
}

const bigRadius = {
  ...middleRadius,
  outer: middleRadius.outer * 1.15
}

const smallRadius = {
  ...middleRadius,
  outer: middleRadius.outer * 0.85
}

const getImage = (src, size, additional = {}): ImageWithPromise => {
  const img = new Image();
  img.src = src;

  const loaded = new Promise<void>(resolve => {
    img.onload = () => resolve()
  });

  return {
    image: img,
    size: size,
    loaded: loaded,
    offsetScale: 0.9,
    ...additional
  };
}

const focus = (arc: MotionArc): MotionArc => ({
  ...arc,
  angle: focusedAngle,
  fill: '#00fff0',
  opacity: 1,
  radius: bigRadius
})

const fromBusinessToMetal = businessWheel => {
  if (!businessWheel) {
    return {
      startRotation: 0,
      arcs: []
    }
  }

  const getTemplate = ({active, focused, selected, icon}) => {
    if (selected) {
      return {
        angle: focusedAngle,
        fill: '#00fff0',
        opacity: 1,
        radius: bigRadius,
        image: getImage(icon, {width: 90, height: 90}, {offsetScale: 0.8})
      }
    }

    if (focused) {
      return active
        ? {
          angle: focusedAngle,
          fill: '#00fff0',
          opacity: 1,
          radius: bigRadius,
          image: getImage(icon, {width: 70, height: 70})
        }
        : {
          angle: focusedAngle,
          fill: '#34495e',
          opacity: 1,
          radius: middleRadius,
          image: getImage(icon, {width: 50, height: 50})
        }
    }

    if (active) {
      return {
        angle: sameAngle,
        fill: '#00fff0',
        opacity: 0.7,
        radius: middleRadius,
        image: getImage(icon, {width: 50, height: 50})
      }
    }

    return {
      angle: sameAngle,
      fill: '#34495e',
      opacity: 0.5,
      radius: smallRadius,
      image: getImage(icon, {width: 40, height: 40}, {opacity: 0.5})
    }
  }

  const arcs = businessWheel.map(businessArc => ({
    ...businessArc,
    ...getTemplate(businessArc)
  }));

  return {
    startRotation: -126,
    arcs: [
      ...arcs,
      {
        id: 'plus',
        angle: 360 - sumAngles(arcs) + arcs.length/2,
        fill: '',
        radius: {
          inner: centerWheel.radius.inner,
          outer: centerWheel.radius.outer + 105
        },
        image: getImage('http://www.clker.com/cliparts/L/q/T/i/P/S/add-button-white-hi.png', {width: 50, height: 50})
      }
    ]
  };
}

export interface Props {
  wheel: BusinessArc[],
  animationPreset: AnimationPreset,
  onFocus: (id: string) => void,
  onFocusLost: (id: string) => void,
  onSelect: (id: string, rotation: number) => void,
  setText: (text: string) => void,
  centerText: string,
}

export interface State {
  clockwiseOverflow: boolean,
  rotationStarted: boolean,
  rotation: number,
  previousRotationState: number
}

const toWheel = (wheel): MotionArc[] => wheel ? wheel.arcs.reduce((allArcs, currentArc) => {
  return [...allArcs, {
    ...currentArc,
    angle: currentArc.angle,
    fill: currentArc.fill,
    rotation: wheel.startRotation + sumAngles(allArcs) - allArcs.length/2
  }]
}, []) : [];

const rotate = (wheel: MotionArc[], rotation: number): MotionArc[] => Boolean(!wheel)
  ? []
  : wheel.map(a => ({...a, rotation: a.rotation + rotation}))

const rotateToSelectedOn12Oclock = (wheel: MotionArc[]) : MotionArc[] => {
  const selected = find(wheel, a => Boolean(a.selected));
  if (!selected) {
    return wheel;
  }

  const targetRotation = -90 - selected.angle/2;
  const difference = targetRotation - selected.rotation;

  return rotate(wheel, difference);
}

const set12OClockAsFocused = (wheel: MotionArc[]) : MotionArc[] => wheel.reduce((accumulator, current) => {
  const shouldBeFocused = Boolean(current.rotation <= -90 && -90 <= current.rotation + focusedAngle)

  return {
    rotationOffset: shouldBeFocused ? (focusedAngle - current.angle) : accumulator.rotationOffset,
    wheel: [...accumulator.wheel, shouldBeFocused ? focus(current) : {
      ...current,
      rotation: current.rotation + accumulator.rotationOffset
    }]
  }
}, {rotationOffset: 0, wheel: []}).wheel

export default class extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      clockwiseOverflow: false,
      rotationStarted: false,
      rotation: 0,
      previousRotationState: 0
    }
  }

  handleRotation = (start, current) => {
    if (!this.state.rotationStarted) {
      this.setState({
        rotationStarted: true,
        rotation: start - current,
        previousRotationState: current
      })
      return
    }

    const getQuadrant = angle => {
      if (angle >= 0 && angle < 90) {
        return 1
      }
      if (angle >= 90 && angle < 180) {
        return 2
      }
      if (angle >= 180 && angle < 270) {
        return 3
      }
      if (angle < 0 && angle >= -90) {
        return 4
      }
    }

    const difference = (previous, current) => {
      const previousQuadrant = getQuadrant(previous)
      const currentQuadrant = getQuadrant(current)

      if (previousQuadrant === 3 && currentQuadrant === 4) {
        return 0
      }

      if (previousQuadrant === 4 && currentQuadrant === 3) {
        return 0
      }

      return previous - current
    }

    this.setState(s => ({
      rotationStarted: true,
      rotation: s.rotation + difference(s.previousRotationState, current),
      previousRotationState: current
    }))
  }

  render () {
    const {wheel, animationPreset, onFocus, onFocusLost, onSelect, setText, centerText} = this.props;

    return <CleanWheel
      wheel={rotate(rotateToSelectedOn12Oclock(toWheel(fromBusinessToMetal(wheel))), this.state.rotation)}
      circle={centerWheel}
      animationPreset={animationPreset}
      onFocus={onFocus}
      onFocusLost={onFocusLost}
      onSelect={onSelect}
      setText={setText}
      centerText={centerText}
      rotate={this.handleRotation}
      resetRotation={() => this.setState({clockwiseOverflow: false, rotation: 0, rotationStarted: false})}
    />
  }
}
