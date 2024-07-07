import RevealCardsSection from '@renderer/components/RevealCardsSection'
import Voting from '@renderer/components/Voting'
import { useParams } from 'react-router-dom'

export default function Planning() {
  const { roomId } = useParams()
  console.log(roomId)
  return (
    <>
      <RevealCardsSection />
      <Voting />
    </>
  )
}
