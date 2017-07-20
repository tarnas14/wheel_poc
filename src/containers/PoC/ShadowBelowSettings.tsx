import * as React from 'react'
import * as style from './style.css'

export default({
  title,
  setShadowSettings,
  shadowBelowSettings
}) =>
    <div className={style.settings}>
      <h3>{title}</h3>
      <hr/>
      <p>
        <label>
          <input type="checkbox" checked={shadowBelowSettings.enabled} onChange={() => {
              setShadowSettings({
                enabled: !shadowBelowSettings.enabled
              })
          }} />show shadow below wheel: ({shadowBelowSettings.enabled.toString()})
        </label>
      </p>
      <p>
        distance from the wheel: ({shadowBelowSettings.distanceFromTheWheel})
        <br />
        <input type="range" className={style.wide} min={-500} max={500} step={1} value={shadowBelowSettings.distanceFromTheWheel}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setShadowSettings({
                distanceFromTheWheel: value
            })
          }}
        />
      </p>
      <p>
        width: ({shadowBelowSettings.width})
        <br />
        <input className={style.wide} type="range" min={0} max={700} step={1} value={shadowBelowSettings.width}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setShadowSettings({
                width: value
            })
          }}
        />
        <br />
        height: ({shadowBelowSettings.height})
        <br />
        <input type="range" min={0} max={300} step={1} value={shadowBelowSettings.height}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setShadowSettings({
                height: value
            })
          }}
        />
      </p>
      <p>
        opacity: ({shadowBelowSettings.opacity})
        <br />
        <input type="range" min={0} max={1} step={0.1} value={shadowBelowSettings.opacity}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setShadowSettings({
                opacity: value
            })
          }}
        />
        <br />
        blur: ({shadowBelowSettings.blurRadius})
        <br />
        <input type="range" min={0} max={100} step={1} value={shadowBelowSettings.blurRadius}
          onChange={e => {
            const value = Number(e.currentTarget.value)
            setShadowSettings({
                blurRadius: value
            })
          }}
        />
      </p>
    </div>
