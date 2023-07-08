import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getUserOnLoad()
  }, [])

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get()
      console.log('accountDetails:', accountDetails)
      setUser(accountDetails)

    } catch(err) {
      console.log(err)
    }
    setLoading(false);
  }

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault()
    console.log("CREDS: ", credentials)

    try {
      const response = await account.createEmailSession(credentials.email, credentials.password);

      const accountDetails = await account.get()
      setUser(accountDetails)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleUserLogout = async () => {
    await account.deleteSession('current');
    setUser(null)
  }

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault()

    if(credentials.password1 !== credentials.password2){
      alert('passwords do not match')
      return
    }
    try {
      const response = await account.create(ID.unique(), credentials.email, credentials.password1, credentials.name)
      
      await account.createEmailSession(credentials.email, credentials.password1)
      const accountDetails = await account.get()
      console.log(accountDetails)
      navigate('/')


    } catch (err) {
      console.log(err)
      
    }
  }
  

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  }

  return <AuthContext.Provider value={contextData}>
    {loading ? <p>Loading...</p> : children}
  </AuthContext.Provider>
}

export const useAuth = () => {return useContext(AuthContext)}

export default AuthContext