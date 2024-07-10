import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import { AuthProvider } from './contexts/authContext'
import { ref, get, child } from 'firebase/database'
import { useEffect } from 'react'
import { db } from './firebase/firebase'
import AddRoomForm from './pages/AddRoom'
import Planning from './pages/Planning'
import { AppProvider } from './contexts/authContext/appContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

  useEffect(() => {
    const dbRef = ref(db)
    get(child(dbRef, `/rooms`)).catch((error) => {
      console.error(error)
    })
  }, [])

  return (
    <>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/rooms/:roomId" element={<Planning />} />
              <Route path="/add-room" element={<AddRoomForm />} />
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
      </AppProvider>
      <ToastContainer />
    </>
  )
}

export default App
