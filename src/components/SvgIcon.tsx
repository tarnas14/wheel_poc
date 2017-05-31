import * as React from 'react'

export default ({path, ...rest}) => <svg {...rest}>
  <path d={path}/>
</svg>
