
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
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
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Dashboard />} />
        <Route path="/" element={<Login />} />

      </Routes>
      {/* <div style={styles.layout}>
        <div style={styles.header}>
          asdasd
        </div>
      

      </div> */}
    </BrowserRouter>
  )
}

export default App
