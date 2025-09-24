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
import { Routes, Route, Link, useNavigation, useMatch, Navigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import { Alert, Nav, Navbar} from 'react-bootstrap'

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


  return (
    <div>
      <div>
        <Navbar  expand = "lg" bg = "dark" variant = "dark" >
          <Navbar.Toggle aria-controls = "responsive-navbar-nav" />
            <Navbar.Collapse id = "responsive-navbar-nav">
              <Nav className = "w-100 fs-5 fw-bold d-flex align-items-center justify-content-evenly">
              <Nav.Link href = "#" as = {Link} to = "/">Home</Nav.Link>
              <Nav.Link href = "#" as = {Link} to = "/blog">Blogs</Nav.Link>
              <Nav.Link href = "#" as = {Link} to = "/user">Users</Nav.Link>
              
              
                {user === null
                ? <Nav.Link href = "#" as = {Link} to ="/login">Login </Nav.Link>
                : <div>{user.username} Logged In <button type = "submit" onClick={handleLogout} className = "btn btn-danger fw-bold">Log Out</button></div>
                }
             
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
        <div className = "container">
        <h2 className=' fw-bolder'>Blogs</h2>
        
        {notification === null ? null : <Alert variant = {notification.type}>{notification.text}</Alert>}
      
        
        {/* Different Routes */}
        <Routes>
          <Route path = "/" element = {
            <div>
              {user === null
              ? null
              : <Togglable buttonLabel = 'Add Blog' >
                  <BlogForm 
                    createBlog={handleBlog}
                    updateBlog = {update} />
                </Togglable>}
              
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
          <Route path = '/login' element = {
              <>
              {user === null 
              ?  <LoginForm username = {username} password = {password} handleLogin = {handleLogin} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} />  
              :  <Navigate replace to = "/" />
              } 
              </>
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
    </div>
  )
}

export default App