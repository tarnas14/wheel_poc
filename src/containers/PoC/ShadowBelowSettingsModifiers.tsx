import * as React from 'react'
import * as style from './style.css'

const Modifier = ({modifier, setModifier, children}) => <div style={{opacity: modifier.use ? 1 : 0.5}}>
  <label><input type="checkbox" checked={modifier.use} onChange={() => setModifier({
    ...modifier,
    use: !modifier.use
  })}/>{children}</label> <input type="number" value={modifier.value} onChange={e => {
    const value = e.currentTarget.value
    setModifier({
      ...modifier,
      value: value
    })
  }}/>
</div>

const modFunc = (modifiers, setModifiers, propertyName) => modifier => setModifiers({
  ...modifiers,
  [propertyName]: modifier
})

export default ({modifiers, setModifiers}) => <div className={style.settings}>
  <h3>magic</h3>
  <hr/>
  <p>
    <Modifier modifier={modifiers.height} setModifier={modFunc(modifiers, setModifiers, 'height')}>shadow height = height * number of insurances *</Modifier>
    <Modifier modifier={modifiers.width} setModifier={modFunc(modifiers, setModifiers, 'width')}>shadow width = width * number of insurances *</Modifier>
    <Modifier modifier={modifiers.opacity} setModifier={modFunc(modifiers, setModifiers, 'opacity')}>shadow opacity = opacity * number of insurances *</Modifier>
    <Modifier modifier={modifiers.blurRadius} setModifier={modFunc(modifiers, setModifiers, 'blurRadius')}>shadow blurRadius = blurRadius * number of insurances *</Modifier>
    <Modifier modifier={modifiers.distanceFromTheWheel} setModifier={modFunc(modifiers, setModifiers, 'distanceFromTheWheel')}>shadow distanceFromTheWheel = distanceFromTheWheel * number of insurances *</Modifier>
  </p>
</div>
