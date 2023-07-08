import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Room from './pages/Room'
import LoginPage from './pages/LoginPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import {AuthProvider} from './utils/AuthContext'
import RegisterPage from './pages/RegisterPage'


function App() {

  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>

          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<Room />} />
          </Route>

          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
