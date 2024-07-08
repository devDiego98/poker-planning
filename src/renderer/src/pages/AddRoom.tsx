import { useState } from 'react'
import { db } from '@renderer/firebase/firebase'
import { ref, push, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@renderer/contexts/authContext'

const AddRoomForm = () => {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState('')
  const { currentUser } = useAuth()
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }
  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value)
  }

  const goToRoom = () => {
    navigate(`/rooms/${roomId}`)
  }
  const handleAddRoom = () => {
    console.log(currentUser)
    const roomsRef = ref(db, 'rooms')
    const newRoomRef = push(roomsRef)

    // Create an object with the user's ID as the key
    const userObject = {
      [currentUser.id]: {
        ...currentUser,
        vote: 0
      }
    }

    set(newRoomRef, {
      name: roomName,
      users: userObject,
      revealedCards: false
    })
      .then((res) => {
        console.log(newRoomRef)
        console.log('Room added successfully')
        setRoomName('')
        let url = `/rooms/${newRoomRef.key}`
        navigate(url)
      })
      .catch((error) => {
        console.error('Error adding room: ', error)
      })
  }
  return (
    <div>
      <h2>Add New Room</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Room Name:
          <input
            type="text"
            className="text-black"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </label>
        <br />

        <button type="button" className="text-white" onClick={handleAddRoom}>
          Add Room
        </button>
      </form>

      <h2>Enter Room</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Room id:
          <input
            type="text"
            className="text-black"
            value={roomName}
            onChange={handleRoomIdChange}
          />
        </label>
        <br />

        <button type="button" className="text-white" onClick={goToRoom}>
          Add Room
        </button>
      </form>
    </div>
  )
}

export default AddRoomForm
