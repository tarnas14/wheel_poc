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
        angle: 360 - sumAngles(arcs) - arcs.length - 1,
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
  onSelect: (id: string) => void,
  setText: (text: string) => void,
  centerText: string,
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

export default ({wheel, animationPreset, onFocus, onFocusLost, onSelect, setText, centerText}: Props ) => <CleanWheel
  wheel={rotateToSelectedOn12Oclock(toWheel(fromBusinessToMetal(wheel)))}
  circle={centerWheel}
  animationPreset={animationPreset}
  onFocus={onFocus}
  onFocusLost={onFocusLost}
  onSelect={onSelect}
  setText={setText}
  centerText={centerText}
/>
