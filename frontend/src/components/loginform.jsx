import PropTypes from 'prop-types'
import {Form, Button} from 'react-bootstrap'

const LoginForm = ({username, password, handleLogin, handleUsernameChange, handlePasswordChange}) => {
    return (
      <div>
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control type = "text" name = "Username" value = {username} onChange={handleUsernameChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control type = "password" name = "Password" value = {password} onChange={handlePasswordChange} />
          </Form.Group>
          <Form.Group>
            <Button type = "submit" className = "btn btn-success mt-2">Log In</Button>
          </Form.Group>
        </Form>
      </div>
    )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm