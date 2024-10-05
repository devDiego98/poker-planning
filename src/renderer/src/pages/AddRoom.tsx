import { useCallback, useState } from 'react'
import { db } from '@renderer/firebase/firebase'
import { ref, push, set, get } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@renderer/contexts/authContext'
import { findRoomByName } from '@renderer/utils'

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

  const goToRoomByName = () => {
    const roomsRef = ref(db, 'rooms');

    // First, find the room by name
    get(roomsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const rooms = snapshot.val();
          let foundRoomId = null;
          let roomData = null;

          // Search for the room by name
          for (const [id, room] of Object.entries(rooms)) {
            if (room.name.toLowerCase() === roomId.toLowerCase()) {
              foundRoomId = id;
              roomData = room;
              break;
            }
          }

          if (foundRoomId) {
            const roomUsersRef = ref(db, `rooms/${foundRoomId}/users`);

            // Check if the user already exists in the room
            if (!roomData.users || !roomData.users[currentUser.uid]) {
              // User doesn't exist, so add them
              const userObject = {
                [currentUser.uid]: {
                  email: currentUser.email,
                  uid: currentUser.uid,
                  vote: 0
                }
              };

              set(roomUsersRef, {
                ...roomData.users,
                ...userObject
              }).then(() => {
                console.log('User added to room successfully');
                navigate(`/rooms/${foundRoomId}`);
              }).catch((error) => {
                console.error('Error adding user to room: ', error);
              });
            } else {
              console.log('User already exists in the room');
              navigate(`/rooms/${foundRoomId}`);
            }
          } else {
            console.log('Room not found');
            // Optionally, create a new room here if desired
          }
        } else {
          console.log('No rooms exist');
        }
      })
      .catch((error) => {
        console.error('Error checking rooms: ', error);
      });
  };

  const handleAddRoom = useCallback(async () => {
    const roomsRef = ref(db, 'rooms')
    const snapshot = await get(roomsRef);

    if (snapshot.exists()) {
      const rooms = snapshot.val();
      const roomExists = findRoomByName(rooms, roomName)
      if (roomExists) return null

    }
    const newRoomRef = push(roomsRef)
    // Create an object with the user's ID as the key
    const userObject = {
      [currentUser.uid]: {
        email: currentUser.email,
        uid: currentUser.uid,
        vote: 0
      }
    }
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
  }, [currentUser, roomName])
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

          <button type="button" className="text-white" onClick={goToRoomByName}>
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddRoomForm
