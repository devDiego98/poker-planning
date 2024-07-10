// AppContext.js
import { createContext, useState } from 'react'

const AppContext = createContext()

const AppProvider = ({ children }) => {
  const [emojiOne, setEmojiOne] = useState()
  const [emojiTwo, setEmojiTwo] = useState()
  const [emojiThree, setEmojiThree] = useState()

  return (
    <AppContext.Provider
      value={{ emojiOne, emojiTwo, emojiThree, setEmojiOne, setEmojiTwo, setEmojiThree }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppProvider, AppContext }
