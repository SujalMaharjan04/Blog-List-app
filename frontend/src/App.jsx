import {useState, useEffect} from 'react'
import blogService from './services/blog'
import Blogs from './components/Blogs'
import login from './services/login'
import LoginForm from './components/loginform'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import {NotificationContext, UserContext} from './context'
import { Routes, Route, Link, useNavigation, useMatch } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'

const App = () => {

  const query = useQueryClient()
  //Context 
  const [notification, dispatch] = useContext(NotificationContext)
  const [user, dispatchUser] = useContext(UserContext)

  //React Query for New Blog
  const newBlog = useMutation({
    mutationFn: blogService.create,
    onSuccess: query.invalidateQueries({queryKey: ['blog']}),
  })

  //Mutate Update Blog for Likes
  const updateBlog = useMutation({
    mutationFn: ({newObject, id}) => blogService.update(newObject, id),
    onSuccess: () => query.invalidateQueries({queryKey: ['blog']}),

    onMutate: async({newObject, id}) => {
      const previousBlog = query.getQueryData(['blog'])

      query.setQueryData(['blog'], (old) => {
         old.map(blog => blog.id === id ? {...blog, newObject} : blog)
      })

      return {previousBlog}
    }
  })

  //Delete Blog Query
  const Delete = useMutation({
    mutationFn: ({id}) => blogService.deleteBlog(id),
    onSuccess: () => query.invalidateQueries({queryKey: ['blog']})
  })
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  

  //Notification function
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

  //User dispatch Function
  const setUser = (user) => {
    dispatchUser({
      type: 'SET_USER',
      payload: user
    })
  }

  //Query for getting the blogs
  const result = useQuery({
    queryKey: ['blog'],
    queryFn: blogService.getAll
  })


  const blogs = result.data ?? []

  //Checking if user has logged out or not
  useEffect(() => {
    const loggedJSON = window.localStorage.getItem('loginBlogAppUser')
    if (loggedJSON) {
      const user = JSON.parse(loggedJSON)
      blogService.setToken(user.token)
      setUser(user)
    } 
  }, [])

  //Function to update blog for likes
  const update = async (newObject) => {
    try {
      const blog = blogs.find(blog => blog.title === newObject.title)
      updateBlog.mutate({newObject, id: blog.id})
      notify( 'Update Successful',  'success')
    }
    catch  {
      notify( 'Update Failed',  'error')
    } 
  }

  //Function to delete a blog
  const deleteBlog = async(id) => {
    try {
      Delete.mutate({id})
      notify( 'Delete Successful',  'success')
    }
    catch  {
      notify( 'Delete Failed',  'error')
    }
  }

  //Function to handle login
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

  //Function to handle Logout
  const handleLogout = () => {
    window.localStorage.removeItem('loginBlogAppUser')
    setUser(null)
    notify( 'Logout successful',  'success')
  }

  //Function to Handle new Blog
  const handleBlog = async (newObject) => {
    try {
      newBlog.mutate(newObject)
      notify(`A new blog ${newObject.title} by ${newObject.author} added`,  'success')
      
    }
    catch  {
      notify( 'Addition of BLog unsuccessful',  'error')
      
    }
  }

  

  const background = {
    backgroundColor: "gray",
    display: "flex",
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem'
  }



  return (
    <div>
      <h2>blogs</h2>
      
      {notification === null ? null : <h2 className = {notification.type}>{notification.text}</h2>}
      <div style={background}>
        <Link to = "/">Home</Link>
        <Link to = "/blog">blogs</Link>
        <Link to = '/user'>users</Link>
        {user === null
          ? <Togglable buttonLabel = "login" >
              <LoginForm username = {username} password = {password} handleLogin = {handleLogin} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} /> 
            </Togglable> : <div>{user.username} Logged In <button type = "submit" onClick={handleLogout} >Log Out</button></div>
        }
      </div>
      
      {/* Different Routes */}
      <Routes>
        <Route path = "/" element = {
          <div>
        
            <Togglable buttonLabel = 'Add Blog'>
              <BlogForm 
                createBlog={handleBlog}
                updateBlog = {update} />
            </Togglable>
            {result.isLoading && <div>Loading....</div>}
            <ul>
              {blogs
                .slice()
                .sort((a, b) => b.likes - a.likes)
                .map(blog => 
              <Blogs key = {blog.id} blog = {blog} updateBlog = {update} deleteBlog = {deleteBlog} user = {user}/>
              )}
            </ul>
        </div>
        } />
        <Route path = "/user" element = {
          <Users />
        } />
        <Route path = "/user/:id" element = {
          <User />
        } />
        <Route path = "/blog/:id" element = {
          <Blog updateBlog = {update} deleteBlog = {deleteBlog}/>
        } />
        <Route path = "/blog" element = {
          <ul>
              {blogs
                .slice()
                .sort((a, b) => b.likes - a.likes)
                .map(blog => 
              <Blogs key = {blog.id} blog = {blog} updateBlog = {update} deleteBlog = {deleteBlog} user = {user}/>
              )}
            </ul>
        } />
      </Routes>
    </div>
  )
}

export default App