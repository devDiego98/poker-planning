import { useParams } from 'react-router-dom'
import Card from './Card'
import { ref, update } from 'firebase/database'
import { db } from '@renderer/firebase/firebase'
import { useAuth } from '@renderer/contexts/authContext'

export default function Voting({ room }) {
  const { roomId } = useParams()
  const { currentUser } = useAuth()
  const fibonacciSequence = ['1', '2', '3', '5', '8', '13', '21', '34', '55']
  function updateUserVote(newVote) {
    console.log(currentUser)
    const userRef = ref(db, `rooms/${roomId}/users/${currentUser.id}`)
    console.log(userRef)
    update(userRef, {
      vote: newVote
    })
      .then(() => {
        console.log('User updated successfully')
      })
      .catch((error) => {
        console.error('Error updating user: ', error)
      })
  }
  return (
    <div style={styles.container}>
      {fibonacciSequence.map((item) => (
        <button
          onClick={() => {
            updateUserVote(item)
          }}
        >
          <Card>{item}</Card>
        </button>
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    gap: '32px'
  }
}
