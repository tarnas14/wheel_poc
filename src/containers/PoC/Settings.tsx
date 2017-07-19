import * as React from 'react'

import * as style from './style.css'
import State from '../../constants/state'

const onEnter = callback => e => e.keyCode === 13
  ? callback(e)
  : undefined

export default ({
  animationPreset,
  animationSetting,
  wheelSettings,
  wheel,
  setAngle,
  setPalette,
  palettes,
  selectedPalette,
  changeStiffness,
  changeDamping,
  setPreset,
  setCenterRadius,
  setActiveRadius,
  setPendingRadius,
  setSuggestionRadius,
  addToWheel,
  removeFromWheel,
  setWheelSettings
}) => {
  const {stiffness, damping} = animationSetting
  const {shadowSettings: {arc: arcShadowSettings}}= wheelSettings

  return <div>
    <div className={style.settings}>
      <h3>add elements here</h3>
      <hr/>
      <p>
        <button onClick={() => addToWheel(State.active)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.active))}>+ active</button>
        <button onClick={() => removeFromWheel(State.active)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.active).length)}>- active</button>
      </p>
      <p>
        <button onClick={() => addToWheel(State.pending)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.pending))}>+ pending</button>
        <button onClick={() => removeFromWheel(State.pending)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.pending).length)}>- pending</button>
      </p>
      <p>
        <button onClick={() => addToWheel(State.suggestion)} disabled={!Boolean(wheel.find(w => w.dontDisplay && w.state === State.suggestion))}>+ suggestion</button>
        <button onClick={() => removeFromWheel(State.suggestion)} disabled={!Boolean(wheel.filter(w => !w.dontDisplay && w.state === State.suggestion).length)}>- suggestion</button>
      </p>
    </div>
    <div className={style.settings}>
      <h3>animation settings here</h3>
      <hr/>
      <p>
        animation style: <br/>
        <select onChange={setPreset} value={animationPreset}>
          <option value="noWobble">noWobble</option>
          <option value="wobbly">wobbly</option>
          <option value="gentle">gentle</option>
          <option value="stiff">stiff</option>
        </select>
      </p>
      <p>
        stiffness: ({stiffness}) <br/> <input type="range" min="0" max="300" value={stiffness} onChange={changeStiffness}/>
      </p>
      <p>
        damping: ({damping}) <br /> <input type="range" min="0" max="40" value={damping} onChange={changeDamping}/>
      </p>
    </div>
    <div className={style.settings}>
      <h3>wheel settings here</h3>
      <hr/>
      <p>
        <label>colour palette
          <select value={selectedPalette} onChange={e => {
            const selected = e.currentTarget.value
            setPalette(selected)
          }}>
            {palettes.map(({name}) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
      </p>
      <p>
        angle: ({wheelSettings.angle})
        <br />
        <input type="range" min="0" max="100" value={wheelSettings.angle}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setAngle(value)
          }}
        />
      </p>
      <p>
        center diameter: ({wheelSettings.centerArea.outer * 2})
        <br />
        <input type="range" min="0" max="300" value={wheelSettings.centerArea.outer}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setCenterRadius(value)
          }}
        />
        <br />
        <input type="number" defaultValue={`${wheelSettings.centerArea.outer * 2}`}
          onKeyDown={onEnter(e => {
            const value = Number(e.currentTarget.value)/2
            setCenterRadius(value)
          })}
        />
      </p>
      <p>
        active diameter: ({wheelSettings.activeRadius * 2})
        <br />
        <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.activeRadius}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setActiveRadius(value)
          }}
        />
      </p>
      <p>
        pending diameter: ({wheelSettings.pendingRadius * 2})
        <br />
        <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.pendingRadius}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setPendingRadius(value)
          }}
        />
      </p>
      <p>
        suggestion diameter: ({wheelSettings.suggestionRadius * 2})
        <br />
        <input type="range" min={wheelSettings.centerArea.outer} max={360} value={wheelSettings.suggestionRadius}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setSuggestionRadius(value)
          }}
        />
      </p>
      <p>
        element spacing: ({wheelSettings.spacing})
        <br />
        <input type="range" min={0} max={10} value={wheelSettings.spacing}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setWheelSettings({...wheelSettings, spacing: value})
          }}
        />
      </p>
    </div>
    <div className={style.settings}>
      <h3>arc shadow settings</h3>
      <hr/>
      <p>
        <label>
          <input type="checkbox" checked={arcShadowSettings.enabled} onChange={() => {
              setWheelSettings({...wheelSettings, shadowSettings: {
                arc: {
                  ...arcShadowSettings,
                  enabled: !arcShadowSettings.enabled
                }
              }})
          }} />enabled: ({arcShadowSettings.enabled.toString()})
        </label>
        <br/>
        <label>
          <input type="checkbox" checked={arcShadowSettings.disableWhenSelected} onChange={() => {
              setWheelSettings({...wheelSettings, shadowSettings: {
                arc: {
                  ...arcShadowSettings,
                  disableWhenSelected: !arcShadowSettings.disableWhenSelected
                }
              }})
          }} />disable shadow when element is selected: ({arcShadowSettings.disableWhenSelected.toString()})
        </label>
      </p>
      <p>
        opacity: ({arcShadowSettings.opacity})
        <br />
        <input type="range" min={0} max={1} step={0.1} value={arcShadowSettings.opacity}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setWheelSettings({...wheelSettings, shadowSettings: {
              arc: {
                ...arcShadowSettings,
                opacity: value
              }
            }})
          }}
        />
        <br />
        blur: ({arcShadowSettings.blur})
        <br />
        <input type="range" min={0} max={100} step={1} value={arcShadowSettings.blur}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setWheelSettings({...wheelSettings, shadowSettings: {
              arc: {
                ...arcShadowSettings,
                blur: value
              }
            }})
          }}
        />
      </p>
      <p>
        offset X: ({arcShadowSettings.offset.x})
        <br />
        <input type="range" min={-50} max={50} step={1} value={arcShadowSettings.offset.x}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setWheelSettings({...wheelSettings, shadowSettings: {
              arc: {
                ...arcShadowSettings,
                offset: {
                  ...arcShadowSettings.offset,
                  x: value
                }
              }
            }})
          }}
        />
        <br/>
        offset Y: ({arcShadowSettings.offset.y})
        <br />
        <input type="range" min={-50} max={50} step={1} value={arcShadowSettings.offset.y}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setWheelSettings({...wheelSettings, shadowSettings: {
              arc: {
                ...arcShadowSettings,
                offset: {
                  ...arcShadowSettings.offset,
                  y: value
                }
              }
            }})
          }}
        />
      </p>
    </div>
  </div>
}
