import { useState } from 'react'
import { db } from '@renderer/firebase/firebase'
import { ref, push, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

const AddRoomForm = () => {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }

  const handleAddRoom = () => {
    const roomsRef = ref(db, 'rooms')
    const newRoomRef = push(roomsRef)

    set(newRoomRef, {
      name: roomName
    })
      .then((res) => {
        console.log(newRoomRef)
        console.log('Room added successfully')
        setRoomName('') // Clear the input after adding
        let url = `/rooms/${newRoomRef.key}`
        console.log(url)
        navigate(url)
        console.log('routing?')
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
    </div>
  )
}

export default AddRoomForm
