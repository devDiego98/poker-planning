
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { AuthProvider } from './contexts/authContext'
function App(): JSX.Element {

  // const styles = {
  //   layout: {
  //     display: 'flex',
  //     flexDirection: 'column' as 'column',
  //     gap: '64px'
  //   },
  //   header: {
  //     color: 'white',
  //     width: '100%',
  //     height: '100px',
  //     background: 'white'
  //   }
  // }


  return (
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />

        </Routes>
        {/* <div style={styles.layout}>
        <div style={styles.header}>
        asdasd
        </div>
        
        
        </div> */}
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
