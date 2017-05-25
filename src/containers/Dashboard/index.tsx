import * as React from 'react'
import BusinessWheel from '../BusinessWheel'

interface State {}

interface Props {
  wheel: BusinessArc[],
  settings: WheelSettings,
  animationSetting: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
  colourPalette: any,
}

export default class extends React.Component<Props, State> {
  render () {
    const {wheel, settings, colourPalette, animationSetting, select, clearSelection} = this.props

    return <BusinessWheel
      wheel={wheel}
      wheelSettings={settings}
      colourPalette={colourPalette}
      animationPreset={animationSetting}
      select={select}
      clearSelection={clearSelection}
    />
  }
}
