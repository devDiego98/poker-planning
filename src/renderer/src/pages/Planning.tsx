import RevealCardsSection from '@renderer/components/RevealCardsSection'
import Voting from '@renderer/components/Voting'
import { useAuth } from '@renderer/contexts/authContext'
import { db } from '@renderer/firebase/firebase'
import { off, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import PPEmojiPicker from '@renderer/components/EmojiPicker'
import VoteStatisticsDashboard from '@renderer/components/VoteStatisticsDashboard'

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


  return (
    <>
      <header>
        <button onClick={openModal}>Pick Emojis</button>
      </header>
      <div className={`${(room as any)?.revealCards ? 'justify-between' : ''} flex `}>
        <RevealCardsSection key={room} room={room} />
        {
          (room as any)?.revealCards &&
          <div className='min-w-[400px]'>
            <VoteStatisticsDashboard data={room} />
          </div>
        }
      </div>
      <Voting />
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
        <PPEmojiPicker />{' '}
      </Modal>
    </>
  )
}
