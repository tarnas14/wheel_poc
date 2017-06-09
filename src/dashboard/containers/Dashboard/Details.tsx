import * as React from 'react'

import SvgIcon from '../../components/SvgIcon'
import BackPath from '../../glyphs/paths/arrowLeft'
import LogoPath from '../../glyphs/paths/vhv'
import './Details.sass'
import '../../types/models'

const localizeCategory = (a: string) => a
const localizeStatus = (b: ArcState) => b

export default ({userInsurance, back, action, palette}: any) => <div className='details'><div className='container'>
    <div className='backButtonContainer' style={{backgroundColor: back.palette.background}}>
        <SvgIcon
            path={BackPath}
            fill={back.palette.fill}
            viewBox='25 25 100 100'
            onClick={back.handler}
        />
    </div>
    <div className='insuranceDetails'>
        <p className='logo'>
            <SvgIcon
                path={LogoPath}
                fill={palette.logo}
                viewBox='5 50 302 302'
            />
        </p>
        <p className='category'>{localizeCategory(userInsurance.category)}</p>
        <p className='status'>{localizeStatus(userInsurance.state)}</p>
    </div>
    <div className='actions'>
        <button style={{backgroundColor: action.palette.background, color: action.palette.color}} onClick={action.handler}>{action.label}</button>
    </div>
</div></div>
