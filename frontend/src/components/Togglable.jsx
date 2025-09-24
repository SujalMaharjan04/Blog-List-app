import {useState} from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideLoginForm = {display: visible ? 'none' : '' }
    const showLoginForm = {display: visible ? '': 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div>
            <div style = {hideLoginForm} className='pt-2'>
                <Button onClick={() => toggleVisibility()} className = "btn btn-success fs-5 fw-bold">{props.buttonLabel}</Button>
            </div>
            <div style = {showLoginForm} className = "p-2">
                {props.children}
                <Button onClick={() => toggleVisibility()} className='mt-2 btn btn-danger'>Cancel</Button>
            </div>
        </div>
    )
}

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglable