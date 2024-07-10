import { AppContext } from '@renderer/contexts/authContext/appContext'
import EmojiPicker from 'emoji-picker-react'
import { useCallback, useContext, useState } from 'react'

export default function PPEmojiPicker() {
  const [index, setIndex] = useState(1) // Initialize index state with 1 (or any default index)
  const { emojiOne, emojiTwo, emojiThree, setEmojiOne, setEmojiTwo, setEmojiThree } =
    useContext(AppContext)

  const handleEmojiClick = useCallback(
    (e) => {
      if (index === 1) {
        setEmojiOne(e.emoji)
      } else if (index === 2) {
        setEmojiTwo(e.emoji)
      } else if (index === 3) {
        setEmojiThree(e.emoji)
      }
    },
    [index]
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div
          onClick={() => setIndex(1)}
          style={{
            width: 50,
            height: 50,
            border: `${index === 1 ? '2px solid blue' : '1px solid black'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
        >
          {emojiOne}
        </div>
        <div
          onClick={() => setIndex(2)}
          style={{
            width: 50,
            height: 50,
            border: `${index === 2 ? '2px solid blue' : '1px solid black'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
        >
          {emojiTwo}
        </div>
        <div
          onClick={() => setIndex(3)}
          style={{
            width: 50,
            height: 50,
            border: `${index === 3 ? '2px solid blue' : '1px solid black'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
        >
          {emojiThree}
        </div>
      </div>
      <EmojiPicker key={index} onEmojiClick={handleEmojiClick} />
    </div>
  )
}
