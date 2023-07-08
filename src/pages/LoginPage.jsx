import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const { user, handleUserLogin } = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    if(user){
      navigate('/')
    }
  }, [])

  const handleInputChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    setCredentials({...credentials, [name]: value})
    console.log(credentials)
  }

  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={(e) => {handleUserLogin(e, credentials)}}>
          <div className='field--wrapper'>
            <label htmlFor="">Email</label>
            <input type="email" required name='email' placeholder='Enter your Email...' value={credentials.email} onChange={handleInputChange} />
          </div>
          <div className='field--wrapper'>
            <label htmlFor="">Password</label>
            <input type="password" required name='password' placeholder='Enter password...' value={credentials.password} onChange={handleInputChange} />
          </div>
          <div className='field--wrapper'>
            <input className='btn btn--lg btn--main' type="submit" value='Login' />
          </div>
        </form>
        {/*eslint-disable-next-line react/no-unescaped-entities*/}
        <p>Don't have an account yet? Register <Link to='/register'>here</Link></p>

      </div>
      
    </div>
  )
}

export default LoginPage