import { useState } from 'react'
import { db } from '@renderer/firebase/firebase'
import { ref, push, set, get } from 'firebase/database'
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
    const roomRef = ref(db, `rooms/${roomId}`)

    // First, check if the room exists
    get(roomRef).then((snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.val()
        const usersRef = ref(db, `rooms/${roomId}/users`)

        // Check if the user already exists in the room
        if (!roomData.users || !roomData.users[currentUser.id]) {
          // User doesn't exist, so add them
          const userObject = {
            [currentUser.id]: {
              ...currentUser,
              vote: 0
            }
          }

          set(usersRef, {
            ...roomData.users,
            ...userObject
          }).then(() => {
            console.log('User added to room successfully')
            navigate(`/rooms/${roomId}`)
          }).catch((error) => {
            console.error('Error adding user to room: ', error)
          })
        } else {
          console.log('User already exists in the room')
          navigate(`/rooms/${roomId}`)
        }
      } else {
        console.log('Room does not exist')
        // You might want to show an error message to the user here
      }
    }).catch((error) => {
      console.error('Error checking room existence: ', error)
    })
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
            value={roomId}
            onChange={handleRoomIdChange}
          />
        </label>
        <br />

        <button type="button" className="text-white" onClick={goToRoom}>
          Enter Room
        </button>
      </form>
    </div>
  )
}

export default AddRoomForm
