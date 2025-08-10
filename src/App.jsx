import {useState, useEffect} from 'react'
import blogService from './services/blog'
import Blog from './components/blogs'
import login from './services/login'
import LoginForm from './components/loginform'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlog] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState({text: null, type: null})

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlog(blogs))
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
    }
    catch  {
      setErrorMessage({text: 'Update Failed', type: 'error'})
      setTimeout(() => {
        setErrorMessage({text:null, type: null})
      }, 5000)
    } 
  }

  const deleteBlog = async(id) => {
    try {
      await blogService.deleteBlog(id)
      setBlog(blogs.filter(blog => blog.id !== id))
      setErrorMessage({text: 'Delete Successful', type: 'success'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
    }
    catch  {
      setErrorMessage({text: 'Delete Unsuccessful', type: 'error'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
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
      setErrorMessage({text: 'You have successfully logged in', type: 'success'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
    }
    catch  {
      setErrorMessage({text: 'Login Unsuccessful', type: 'error'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
    }
  } 

  const handleLogout = () => {
    window.localStorage.removeItem('loginBlogAppUser')
    setUser(null)
    setErrorMessage({text: 'Logged Out', type: 'success'})
    setTimeout(() => {
        setErrorMessage({ext: null, type: null})
      }, 5000)
  }

  const handleBlog = async (newObject) => {
    try {
      const result = await blogService.create(newObject)
      setBlog(blogs.concat(result))
      setErrorMessage({text:`A new blog ${result.title} by ${result.author} added`, type: 'success'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
    }
    catch  {
      setErrorMessage({text: 'Addition of BLog unsuccessful', type: 'error'})
      setTimeout(() => {
        setErrorMessage({text: null, type: null})
      }, 5000)
    }
  }



  return (
    <div>
      <h2>blogs</h2>
      {errorMessage === null ? null : <h2 className = {errorMessage.type}>{errorMessage.text}</h2>}
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