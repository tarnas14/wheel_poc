import * as React from 'react'
import {Path, Group, Circle, Stage, Layer} from 'react-konva'

import PlusOptions from './PlusOptions'
import SelectedSuggestionActions from './SelectedSuggestionActions'
import State from '../../constants/state'
import BusinessWheel from '../BusinessWheel'
import GoForwardButton from './GoForwardButton'
import OnlySuggestionsCallToAction from './OnlySuggestionsCallToAction'
import {displayed} from '../../util'
import SvgIcon from '../../components/SvgIcon'
import arrowPath from '../../glyphs/paths/arrowLeft'
import '../../types/models.ts'
import {find} from 'lodash'

import './style.sass'

const plusSelected = (wheel: BusinessArc[]): boolean => Boolean(wheel.filter(w => w.state === State.plus && w.selected).length)
const onlySuggestionsInTheWheel = (wheel: BusinessArc[]) =>
    !Boolean(displayed(wheel).filter((w: BusinessArc) => w.state === State.active || w.state === State.pending).length)
const selectedWithButton = (wheel: BusinessArc[]) => find(wheel, w => Boolean(w.state === State.active && w.selected && w.nextAction))

interface State {
  scale: number
}

interface Props {
  wheel: BusinessArc[],
  settings: WheelSettings,
  animationSetting: AnimationPreset,
  select: (id: string) => void,
  clearSelection: () => void,
  colourPalette: any
}

export default class extends React.Component<Props, State> {
  stage: any

  constructor() {
    super()
    this.state = {
      scale: 1
    }
  }

  componentDidMount () {
    const {settings: {origin: wheelOrigin}} = this.props
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

  cursor = (cursorStyle: string) => {
    this.stage.getStage().container().style.cursor = cursorStyle
  }

  renderBackButton = (colour: string) => {
    return <div className='backButtonContainer'>
      <SvgIcon
        path={arrowPath}
        fill={colour}
        viewBox='0 0 50 50'
        onClick={this.props.clearSelection}
      />
    </div>
  }

  renderCenter () {
    const {wheel} = this.props
    const selected = find(wheel, w => w.selected)

    if (!selected) {
      return undefined
    }

    return this.renderBackButton(this.props.colourPalette.active)
  }

  render () {
    const {wheel, settings, colourPalette, animationSetting, select, clearSelection} = this.props
    const {cdRadius, origin: wheelOrigin} = settings
    const {scale} = this.state
    const selectedSuggestion = find(wheel, w => Boolean(w. selected && w.state === State.suggestion))
    const selectedButton = selectedWithButton(wheel)

    return <div
      className='stageContainer'
      style={{width: `${wheelOrigin.x * 2 * scale}px`, height: `${wheelOrigin.y * 2 * scale}px`}}
    >
      {this.renderCenter()}
      <Stage ref={(r: any) => {this.stage = r}} scaleX={scale} scaleY={scale} width={wheelOrigin.x * 2 * scale} height={wheelOrigin.y * 2 * scale}>
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
        {onlySuggestionsInTheWheel(wheel) && <OnlySuggestionsCallToAction
          setCursor={this.cursor}
          wheelOrigin={wheelOrigin}
          colourPalette={{background: colourPalette.cta, font: colourPalette.icons}}
          activeRadius={settings.activeRadius}
          text={'Versicherung hinzufügen'}
        />}
        {plusSelected(wheel) && <PlusOptions
          colourPalette={colourPalette}
          showStroke={false}
          wheelOrigin={wheelOrigin}
          activeRadius={settings.activeRadius}
          cdRadius={cdRadius}
          setCursor={this.cursor}
          interactions={{
            bottom: {
              action: () => {},
              text: 'Bestehende Versicherung erganzen'
            },
            right: {
              action: () => {},
              text: 'Versicherungsbedarf ermitteln'
            },
            upper: {
              action: () => {},
              text: 'Neue Versicherung finden'
            }
          }}
          addCtaText='Hinzufugen'
        />}
        {selectedSuggestion && <SelectedSuggestionActions
          suggestion={selectedSuggestion}
          setCursor={this.cursor}
          addExisting={id => console.log('adding existing to/with', id)}
          lockNew={id => console.log('doing something with new insurance', id)}
          colourPalette={{
            divider: colourPalette.pending,
            action: {
              background: colourPalette.cta,
              font: colourPalette.icons
            }
          }}
          wheelOrigin={wheelOrigin}
          cdRadius={cdRadius}
          activeRadius={settings.activeRadius}
        />}
      </Stage>
      {selectedButton && <GoForwardButton
        wheelOrigin={wheelOrigin}
        cdRadius={cdRadius}
        activeRadius={settings.activeRadius}
        colourPalette={colourPalette}
        scale={scale}
      />}
    </div>
  }
}
