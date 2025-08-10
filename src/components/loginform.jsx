import PropTypes from 'prop-types'

const LoginForm = ({username, password, handleLogin, handleUsernameChange, handlePasswordChange}) => {
    return (
      <div>
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input type = "text" name = "Username" value = {username} onChange={handleUsernameChange} />
          </div>
          <div>
            Password:
            <input type = "password" name = "Password" value = {password} onChange={handlePasswordChange} />
          </div>
          <div>
            <button type = "submit">Log In</button>
          </div>
        </form>
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