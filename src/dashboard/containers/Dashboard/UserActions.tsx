import * as React from 'react'

import SvgIcon from '../../components/SvgIcon'
import BackPath from '../../glyphs/paths/arrowLeft'
import LogoPath from '../../glyphs/paths/vhv'
import './Details.sass'
import './UserActions.sass'
import '../../types/models'

const option = (o: any, maxWidth: number) => o
    ? <li>
        <a onClick={o.action}>
            <SvgIcon
                path={o.icon}
                fill='white'
                viewBox='43 43 70 70'
            />
            <p style={{maxWidth: `${maxWidth}%`}}>{o.label}</p>
        </a>
    </li>
    : null

export default ({back, options, title}: any) => <div className='userActions details'><div className='container'>
    <div className='backButtonContainer' style={{backgroundColor: back.palette.background}}>
        <SvgIcon
            path={BackPath}
            fill={back.palette.fill}
            viewBox='25 25 100 100'
            onClick={back.handler}
        />
    </div>
    {title && <h2>{title}</h2>}
    <ul className='options'>
        {option(options[0], 100)}
        {option(options[1], 77)}
        {option(options[2], 50)}
    </ul>
</div></div>
