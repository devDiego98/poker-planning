import RevealCardsSection from '@renderer/components/RevealCardsSection'
import Voting from '@renderer/components/Voting'
import { useAuth } from '@renderer/contexts/authContext'
import { db } from '@renderer/firebase/firebase'
import { off, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import PPEmojiPicker from '@renderer/components/EmojiPicker'
export default function Planning() {
  const { roomId } = useParams()
  const { currentUser }: any = useAuth()
  const [room, setRoom] = useState()
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }
  useEffect(() => {
    console.log(window.location.href)
  })
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
    return
  }, [currentUser])
  const copyLinkToClipboard = () => {
    const url = window.location.href

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('Page URL copied to clipboard:', url)
        // Optionally, you can show a success message or perform other actions here
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
        // Handle errors here
      })
  }
  return (
    <>
      <button onClick={copyLinkToClipboard}>Copy Link</button>
      <header>
        <button onClick={openModal}>Pick Emojis</button>
      </header>
      <RevealCardsSection key={room} room={room} />
      <Voting />
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <PPEmojiPicker />{' '}
      </Modal>
    </>
  )
}
