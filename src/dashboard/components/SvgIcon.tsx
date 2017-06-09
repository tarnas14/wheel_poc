import * as React from 'react'

export default ({path, ...rest}: {path: string, fill: string, viewBox: string, onClick: () => void}) => <svg {...rest}>
  <path d={path}/>
</svg>
