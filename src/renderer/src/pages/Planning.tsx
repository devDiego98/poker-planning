import RevealCardsSection from '@renderer/components/RevealCardsSection'
import Voting from '@renderer/components/Voting'
import { useAuth } from '@renderer/contexts/authContext'
import { db } from '@renderer/firebase/firebase'
import EmojiPicker from 'emoji-picker-react'
import { off, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import PPEmojiPicker from '@renderer/components/EmojiPicker'
export default function Planning() {
  const { roomId } = useParams()
  const { currentUser } = useAuth()
  const [room, setRoom] = useState()
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }
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
      return () => off(roomRef, 'value', unsubscribe)
    }
  }, [currentUser])
  return (
    <>
      <header>
        <button onClick={openModal}>Pick Emojis</button>
      </header>
      <RevealCardsSection key={room} room={room} />
      <Voting room={room} />
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <PPEmojiPicker />{' '}
      </Modal>
    </>
  )
}
