import {useState, useEffect} from 'react'
import blogService from './services/blog'
import Blog from './components/blogs'
import login from './services/login'
import LoginForm from './components/loginform'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { getAll } from './request'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const [blogs, setBlog] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const notify = (text, type) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: {text, type}
    })

    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      })
    }, 5000)
  }

  useEffect(() => {
     blogService.getAll().then(blogs => setBlog(blogs))
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
      const blog = blogs.find(blog => blog.title === newObject.title)
      const result = await blogService.update(newObject, blog.id)
      setBlog(blogs.map(blog => blog.title === newObject.title ? result : blog))
      notify( 'Update Successful',  'success')
    }
    catch  {
      notify( 'Update Failed',  'error')
    } 
  }

  const deleteBlog = async(id) => {
    try {
      await blogService.deleteBlog(id)
      setBlog(blogs.filter(blog => blog.id !== id))
      notify( 'Delete Successful',  'success')
    }
    catch  {
      notify( 'Delete Failed',  'error')
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
      notify('You have successfully logged in',  'success')
    }
    catch  {
      notify('Login Failed',  'error')
    }
  } 

  const handleLogout = () => {
    window.localStorage.removeItem('loginBlogAppUser')
    setUser(null)
    notify( 'Logout successful',  'success')
  }

  const handleBlog = async (newObject) => {
    try {
      const result = await blogService.create(newObject)
      setBlog(blogs.concat(result))
      console.log('response',result)
      console.log('blog.user', result.user)
      notify(`A new blog ${result.title} by ${result.author} added`,  'success')
      
    }
    catch  {
      notify( 'Addition of BLog unsuccessful',  'error')
      
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
          {blogs
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map(blog => 
          <Blog key = {blog.id} blog = {blog} updateBlog = {update} deleteBlog = {deleteBlog} user = {user}/>
          )}
        </ul>
      </div>}
    </div>
  )
}

export default App