import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import blogService from './services/blog'
import Blog from './components/blogs'
import login from './services/login'
import LoginForm from './components/loginform'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { setNotification, clearNotification } from './reducers/notificationreducer'
import {addBlog, updatedBlog, newBlog, removeBlog} from './reducers/blogReducer'


const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blog)
  

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const notify = (text, type) => {
    dispatch(setNotification({text, type}))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {console.log(blogs) 
        dispatch(newBlog(blogs))})
  }, [])

  useEffect(() => {
    const loggedJSON = window.localStorage.getItem('loginBlogAppUser')
    if (loggedJSON) {
      const user = JSON.parse(loggedJSON)
      blogService.setToken(user.token)
      setUser(user)
    } 
  }, [])

  const update = async (newObject) => {
    try {
      const result = await blogService.update(newObject.id, newObject)
      
      dispatch(updatedBlog(result))
      notify('Update Successful', 'success')
    }
    catch  {
     notify('Update Failed', 'error')
    } 
  }

  const deleteBlog = async(id) => {
    try {
      await blogService.deleteBlog(id)
      dispatch(removeBlog(id))
      notify('Delete Successful', 'success')
    }
    catch  {
      notify('Delete Unsuccessful', 'error')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      if (!username || !password) {
        alert('Username and password are required')
        return
      }
      const user = await login.login({username, password})
      window.localStorage.setItem(
        'loginBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify('You have successfully logged in', 'success')
    }
    catch  {
      notify('Login Unsuccessful', 'error')
    }
  } 

  const handleLogout = () => {
    window.localStorage.removeItem('loginBlogAppUser')
    setUser(null)
    notify('Logged Out', 'success')
  }

  const handleBlog = async (newObject) => {
    try {
      const result = await blogService.create(newObject)
      dispatch(addBlog(result))
      notify(`A new blog ${result.title} by ${result.author} added`, 'success')
    }
    catch  {
      notify('Addition of Blog Unsuccessful', 'error')
    }
  }



  return (
    <div>
      <h2>blogs</h2>
      {notification === null ? null : <h2 className = {notification.type}>{notification.text}</h2>}
      {user === null
        ? <Togglable buttonLabel = "login" >
            <LoginForm username = {username} password = {password} handleLogin = {handleLogin} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} /> 
          </Togglable> : 
      <div>
        {user.username} Logged In <button type = "submit" onClick={handleLogout} >Log Out</button>
        <Togglable buttonLabel = 'Add Blog'>
          <BlogForm 
            createBlog={handleBlog}
            updateBlog = {update} />
        </Togglable>
        
        <ul>
          {console.log(blogs)}
          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map(blog => 
          <Blog key = {blog.id} blog = {blog} updateBlog = {update} deleteBlog = {deleteBlog} user = {user} blogUser = {blog.user}/>
          )}
        </ul>
      </div>}
    </div>
  )
}

export default App