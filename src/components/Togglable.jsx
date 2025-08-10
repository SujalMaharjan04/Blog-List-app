import {useState} from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideLoginForm = {display: visible ? 'none' : '' }
    const showLoginForm = {display: visible ? '': 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    return (
        <div>
            <div style = {hideLoginForm}>
                <button onClick={() => toggleVisibility()}>{props.buttonLabel}</button>
            </div>
            <div style = {showLoginForm}>
                {props.children}
                <button onClick={() => toggleVisibility()}>Cancel</button>
            </div>
        </div>
    )
}

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Togglable