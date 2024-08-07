import { useCallback, useState } from 'react'
import { db } from '@renderer/firebase/firebase'
import { ref, push, set, get } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@renderer/contexts/authContext'

const AddRoomForm = () => {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState('')
  const { currentUser }: any = useAuth()
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }
  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value)
  }

  const goToRoom = () => {
    const roomRef = ref(db, `rooms/${roomId}`)

    // First, check if the room exists
    get(roomRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const roomData = snapshot.val()
          const roomUsersRef = ref(db, `rooms/${roomId}/users`)

          // Check if the user already exists in the room
          if (!roomData.users || !roomData.users[currentUser.id]) {
            // User doesn't exist, so add them
            const userObject = {
              [currentUser.uid]: {
                email: currentUser.email,
                uid: currentUser.uid,
                vote: 0
              }
            }

            set(roomUsersRef, {
              ...roomData.users,
              ...userObject
            }).catch((error) => {
              console.error('Error adding user to room: ', error)
              return
            })
          } else {
            console.log('User already exists in the room')
          }
        } else {
          console.log('Room does not exist')
          return
        }
        navigate(`/rooms/${roomId}`)
      })
      .catch((error) => {
        console.error('Error checking room existence: ', error)
      })
  }
  const handleAddRoom = useCallback(() => {
    const roomsRef = ref(db, 'rooms')
    const newRoomRef = push(roomsRef)
    console.log(currentUser)
    // Create an object with the user's ID as the key
    const userObject = {
      [currentUser.uid]: {
        email: currentUser.email,
        uid: currentUser.uid,
        vote: 0
      }
    }
    console.log(userObject)
    set(newRoomRef, {
      name: roomName,
      users: userObject,
      revealedCards: false
    })
      .then(() => {
        console.log('Room added successfully')
        setRoomName('')
        let url = `/rooms/${newRoomRef.key}`
        navigate(url)
      })
      .catch((error) => {
        console.error('Error adding room: ', error)
      })
  }, [currentUser])
  return (
    <div>
      <div>
        <h2>Add New Room</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-4">
            <label htmlFor="create-room-name">Room Name:</label>
            <input
              id="create-room-name"
              placeholder="example room name"
              type="text"
              className="text-black pl-2"
              value={roomName}
              onChange={handleRoomNameChange}
            />
          </div>

          <button type="button" className="text-white" onClick={handleAddRoom}>
            Add Rooms
          </button>
        </form>
      </div>
      <div className="flex gap-2 mt-8">
        <h4>Already have a room?</h4>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-4">
          <input
            placeholder="room id"
            type="text"
            className="text-black pl-2 max-w-[10px]"
            style={{ maxWidth: '150px' }}
            value={roomId}
            onChange={handleRoomIdChange}
          />

          <button type="button" className="text-white" onClick={goToRoom}>
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddRoomForm
