import RevealCardsSection from '@renderer/components/RevealCardsSection'
import Voting from '@renderer/components/Voting'
import { useAuth } from '@renderer/contexts/authContext'
import { db } from '@renderer/firebase/firebase'
import { off, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Planning() {
  const { roomId } = useParams()
  const { currentUser } = useAuth()
  const [room, setRoom] = useState()
  useEffect(() => {
    if (currentUser) {
      const roomRef = ref(db, `rooms/${roomId}`)

      const unsubscribe = onValue(
        roomRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setRoom(snapshot.val())
          } else {
            console.log('No user data available')
          }
        },
        (error) => {
          console.error('Error fetching user data:', error)
        }
      )

      // Cleanup function to unsubscribe when component unmounts
      return () => off(roomRef, 'value', unsubscribe)
    }
  }, [currentUser])
  return (
    <>
      <RevealCardsSection key={room} room={room} />
      <Voting room={room} />
    </>
  )
}
