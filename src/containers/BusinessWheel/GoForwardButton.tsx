import * as React from 'react'
import State from '../../constants/state'
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

const shouldHaveButton = (wheel: GestaltArc[]) => wheel.find(w => Boolean(w.state === State.active && w.selected && w.nextAction))

export default ({wheel, activeRadius, wheelOrigin, cdRadius, scale, colourPalette}) => {
    const selectedWithButton = shouldHaveButton(wheel)

    if (!selectedWithButton) {
      return null
    }

    const radius = scale * cdRadius.inner * 1.1
    const x = scale * (wheelOrigin.x - radius + activeRadius.outer * 0.35)
    const y = scale * (wheelOrigin.y - radius + activeRadius.outer * 0.35)

    return <div style={{
      cursor: 'pointer',
      borderRadius: '50%',
      position: 'absolute',
      width: `${radius*2}px`,
      height: `${radius*2}px`,
      backgroundColor: colourPalette.nextButton.background,
      left: `${x}px`,
      top: `${y}px`,
    }}>
      <ArrowRight
        style={{height: 'auto', width: 'auto', color: colourPalette.nextButton.icon}}
        onClick={selectedWithButton.nextAction}
      />
    </div>
}
