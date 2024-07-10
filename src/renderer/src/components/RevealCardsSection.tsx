import { useContext, useEffect, useState } from 'react'
import Card from './Card'
import { get, off, onChildChanged, onValue, push, ref, set, update } from 'firebase/database'
import { db } from '@renderer/firebase/firebase'
import { useParams } from 'react-router-dom'
import { useBallThrow } from '@renderer/hooks/useBallThrow'
import { AppContext } from '@renderer/contexts/authContext/appContext'

export default function RevealCardsSection({ room }) {
  const { emojiOne, emojiTwo, emojiThree } = useContext(AppContext)

  const { balls, throwBallAtElement } = useBallThrow(200)
  const [cardsFlipped, setCardsFlipped] = useState(false)
  const { roomId } = useParams()
  const [layout, setLayout] = useState({
    top: [
      {
        name: ''
      }
    ],
    bottom: [
      {
        name: ''
      }
    ]
  })

  const handleUsersLayout = (users) => {
    // Calculate the midpoint
    const midpoint = Math.ceil(users.length / 2)

    // Split the array into two halves
    const firstHalf = Object.values(users)?.slice(0, midpoint)
    const secondHalf = Object.values(users)?.slice(midpoint)
    console.log(firstHalf, secondHalf)

    setLayout({
      top: [...(firstHalf as [])],
      bottom: [...(secondHalf as [])]
    })
  }
  useEffect(() => {
    handleUsersLayout(room?.users || [])
  }, [room])
  useEffect(() => {
    console.log(layout)
  }, [layout.top.length])
  const reveal = () => {
    const userRef = ref(db, `rooms/${roomId}`)
    update(userRef, {
      revealCards: true
    }).catch((error) => {
      console.error('Error updating card reveal: ', error)
    })
  }
  const hideCards = () => {
    const userRef = ref(db, `rooms/${roomId}`)
    update(userRef, {
      revealCards: false
    }).catch((error) => {
      console.error('Error updating card reveal: ', error)
    })
  }
  const storeEmojiToThrow = async (userId: string, newEmoji: string) => {
    const userEmojisRef = ref(db, `rooms/${roomId}/users/${userId}/emojis`)
    try {
      // Get current emojis array
      const snapshot = await get(userEmojisRef)
      let currentEmojis = snapshot.val() || []
      if (!Array.isArray(currentEmojis)) {
        currentEmojis = Object.values(currentEmojis)
          .map((item) => (item as any).code)
          .filter(Boolean)
      }
      if (newEmoji) {
        currentEmojis.push(newEmoji)
      }
      const validEmojis = currentEmojis.filter(Boolean)
      await set(userEmojisRef, validEmojis)
      await set(userEmojisRef, [])
    } catch (error) {
      console.error('Error storing emoji:', error)
    }
  }
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}/revealCards`)

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCardsFlipped(snapshot.val())
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
  }, [])
  const watchUserEmojis = () => {
    const usersRef = ref(db, `rooms/${roomId}/users`)

    const handleEmojiChange = (snapshot: any) => {
      const userData = snapshot.val()

      if (userData && userData.emojis) {
        const userId = snapshot.key
        const emojisArray = Object.values(userData.emojis) as []
        console.log(userData)
        // Call your function here with the updated emojis array
        handleUpdatedEmojis(userId, emojisArray)
      }
    }
    onChildChanged(usersRef, handleEmojiChange)

    // Return a function to remove the listener when no longer needed
    return () => off(usersRef, 'child_changed', handleEmojiChange)
  }
  useEffect(() => {
    const unsubscribe = watchUserEmojis()
    return () => unsubscribe() // Clean up on unmount
  }, [])
  const handleUpdatedEmojis = (userId: string, emojis: string[]) => {
    const rect = document.getElementById(userId)?.getBoundingClientRect()
    throwBallAtElement(rect, emojis)
  }
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}/revealCards`)

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCardsFlipped(snapshot.val())
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
  }, [])

  return (
    <div className="flex flex-1 m-auto items-center">
      <div>
        {balls.map((ball) => (
          <div
            key={ball.id}
            style={{
              position: 'absolute',
              left: ball.x - 10, // Centering the ball
              top: ball.y - 10, // Centering the ball
              width: 20,
              height: 20,
              fontSize: 48,
              borderRadius: '50%',
              transform: `rotate(${ball.rotation}deg)`
            }}
          >
            {ball.emojis[ball.emojis.length - 1]}
          </div>
        ))}
      </div>

      <div className="table-module-container is-user-lonely" style={styles.container}>
        <div className="top" style={styles.top}>
          {!!layout.top.length &&
            layout.top.map((user) => (
              <div id={user.id} key={user.id}>
                <div style={{ display: 'flex' }}>
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiOne)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiOne}
                  </div>
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiTwo)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiTwo}
                  </div>
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiThree)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiThree}
                  </div>
                </div>
                <Card user={user} flipped={cardsFlipped} flippable>
                  {user?.vote || ''}
                </Card>
              </div>
            ))}
        </div>
        <div className="table" style={styles.table}>
          <div className="table-content" style={styles.tableContent}>
            <div className="show-cards-wrapper" style={styles.showCardsWrapper}>
              <button
                className="reveal-cards-button Button-module--button--1b645 Button-module--style-primary--eec70 Button-module--color-primary--bb7ea is-clickable"
                type="button"
                data-test="reveal-cards-button"
                style={styles.revealCardsButton}
              >
                <span className="Button-module--content--85ef4 is-clickable">
                  <span className="Button-module--label--e4390 is-clickable">
                    <span
                      className="label-big-screen"
                      onClick={() => {
                        cardsFlipped ? hideCards() : reveal()
                      }}
                    >
                      {cardsFlipped ? 'New Game' : 'Reveal Cards'}
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="bottom" style={styles.bottom}>
          {layout.bottom.map((user) => (
            <>
              <div id={user.id} key={user.id} className="card-container">
                <div
                  className="card-emoji-picker"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    paddingBottom: '16px'
                  }}
                >
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiOne)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiOne}
                  </div>
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiTwo)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiTwo}
                  </div>
                  <div
                    onClick={() => storeEmojiToThrow(user.id, emojiThree)}
                    style={{
                      width: 50,
                      height: 50,
                      border: `1px solid black`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    {emojiThree}
                  </div>
                </div>
                <Card user={user} nameAlign="bottom" flipped={cardsFlipped} flippable>
                  {user.vote}
                </Card>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'grid',
    gridGap: '2.8rem',
    gridTemplateAreas: `
      "top"
      "table"
      "bottom"
    `,
    gridTemplateRows: 'auto 1fr auto',
    margin: '0 auto',
    minHeight: '200px',
    width: 'auto'
  },
  top: {
    gridArea: 'top',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '64px'
  },
  invitePlayersContainer: {
    gridArea: 'invite',
    display: 'flex',
    alignItems: 'center'
  },
  invitePlayersLabel: {
    marginBottom: '0.5rem'
  },
  invitePlayersButton: {
    // Add button styles here
  },

  table: {
    gridArea: 'table',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableContent: {
    // Add table content styles here
  },
  showCardsWrapper: {
    // Add show cards wrapper styles here
  },
  revealCardsButton: {
    // Add reveal cards button styles here
  },

  bottom: {
    gridArea: 'bottom',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '64px'
  },
  playerContainer: {
    // Add player container styles here
  },
  playerWrapper: {
    display: 'flex'

    // flexDirection: 'column',
    // alignItems: 'center'
  },
  cardContainer: {
    marginBottom: '1rem'
  },
  card: {
    display: 'flex'
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  valueSide: {
    marginBottom: '0.5rem'
  },
  storyPointsPicker: {
    // Add story points picker styles here
  },
  valueSideEmpty: {
    // Add value side empty styles here
  },
  pictureSide: {
    // Add picture side styles here
  },
  profileContainer: {},
  playerName: {
    fontWeight: 'bold'
  }
}
