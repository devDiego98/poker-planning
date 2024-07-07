import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/AddRoom'
import Register from './pages/Register'
import { AuthProvider } from './contexts/authContext'
import { getDatabase, ref, set, onValue, get, child } from 'firebase/database'
import { useEffect, useState } from 'react'
import { db } from './firebase/firebase'
import AddRoomForm from './pages/AddRoom'
import Planning from './pages/Planning'
function App(): JSX.Element {
  const [data, setData] = useState(null)
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
    get(child(dbRef, `/rooms`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val())
        } else {
          console.log('No data available')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
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
  )
}

export default App
