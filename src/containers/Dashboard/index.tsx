import * as React from 'react'
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import {Group, Circle, Stage, Layer} from 'react-konva'
import PlusOptions from './PlusOptions'
import SelectedSuggestionActions from './SelectedSuggestionActions'

import State from '../../constants/state'
import BusinessWheel from '../BusinessWheel'
import GoForwardButton from './GoForwardButton'
import * as style from './style.css'

const plusSelected = (wheel: BusinessArc[]): boolean => Boolean(wheel.filter(w => w.state === State.plus && w.selected).length)
const onlySuggestionsInTheWheel = (wheel: BusinessArc[]) => Boolean(wheel.filter(w => w.state === State.active || w.state === State.pending).length)

interface State {
  scale: number
}

interface Props {
  wheel: BusinessArc[],
  settings: WheelSettings,
  animationSetting: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
  colourPalette: any,
  wheelOrigin: {x: number, y: number}
}

export default class extends React.Component<Props, State> {
  stage: any

  constructor() {
    super()
    this.state = {
      scale: 1,
    }
  }

  componentDidMount () {
    const {wheelOrigin} = this.props
    const updateScale = () => {
      const innerWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width)
      const containerWidth = innerWidth > wheelOrigin.x * 2 ? wheelOrigin.x * 2 : innerWidth
      const widthScale = containerWidth / (wheelOrigin.x * 2)

      const innerHeight = (screen.height)
      const containerHeight = innerHeight > wheelOrigin.y * 2 ? wheelOrigin.y * 2 : innerHeight
      const heightScale = containerHeight / (wheelOrigin.y * 2)

      const scale = Math.min(widthScale, heightScale)

      this.setState({scale})
    }

    updateScale()
    window.onresize = updateScale
  }

  cursor = cursorStyle => {
    this.stage.getStage().container().style.cursor = cursorStyle
  }

  renderBackButton = (colour: string) => {
    return <ArrowLeft
      style={{height: 'auto', width: 'auto', color: colour, cursor: 'pointer'}}
      onClick={this.props.clearSelection}
    />
  }

  renderCenter () {
    const {wheel} = this.props
    const selected = wheel.find(w => w.selected)

    if (!selected) {
      return null
    }

    return this.renderBackButton(selected.id === 'plus' ? this.props.colourPalette.activePlus_backButton : this.props.colourPalette.active)
  }

  render () {
    const {wheel, wheelOrigin, settings, colourPalette, animationSetting, select, clearSelection} = this.props
    const {scale} = this.state

    const cdRadius = {
      inner: 50,
      outer: settings.activeRadius
    }

    return <div
      className={style.stageContainer}
      style={{width: `${wheelOrigin.x*2*scale}px`, height: `${wheelOrigin.y*2*scale}px`}}
    >
      <div className={style.centerContainer}>
        {this.renderCenter()}
      </div>
      <Stage ref={r => {this.stage = r}} scaleX={scale} scaleY={scale} width={wheelOrigin.x*2*scale} height={wheelOrigin.y*2*scale}>
        <BusinessWheel
          wheelOrigin={wheelOrigin}
          disabled={onlySuggestionsInTheWheel(wheel)}
          wheel={wheel}
          wheelSettings={settings}
          colourPalette={colourPalette}
          animationPreset={animationSetting}
          select={select}
          clearSelection={clearSelection}
        />
        {plusSelected(wheel) && <PlusOptions
          colourPalette={colourPalette}
          showStroke={false}
          wheelOrigin={wheelOrigin}
          activeRadius={settings.activeRadius}
          cdRadius={cdRadius}
          setCursor={this.cursor}
          addExistingInsurance={() => console.log('Bestehende Versicherung hinzufugen')}
          lockNewInsurance={() => console.log('Neue abschliesen')}
          checkRequirements={() => console.log('Versicherungsbedarf ermitteln')}
        />}
        <SelectedSuggestionActions
          suggestion={wheel.find(w => Boolean(w.selected && w.state === State.suggestion))}
          setCursor={this.cursor}
          addExisting={id => console.log('adding existing to/with', id)}
          lockNew={id => console.log('doing something with new insurance', id)}
          colourPalette={colourPalette.suggestionActions}
          wheelOrigin={wheelOrigin}
          cdRadius={cdRadius}
          activeRadius={settings.activeRadius}
        />
      </Stage>
      <GoForwardButton
        wheel={wheel}
        wheelOrigin={wheelOrigin}
        cdRadius={cdRadius}
        activeRadius={settings.activeRadius}
        colourPalette={colourPalette}
        scale={scale}
      />
    </div>
  }
}
