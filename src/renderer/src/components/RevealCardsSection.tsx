import { useEffect, useState } from 'react'
import Card from './Card'
import { off, onValue, ref, update } from 'firebase/database'
import { db } from '@renderer/firebase/firebase'
import { useParams } from 'react-router-dom'
import { useBallThrow } from '@renderer/hooks/useBallThrow'

export default function RevealCardsSection({ room }) {
  const { balls, throwBallAtElement } = useBallThrow();
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
    console.log('USERS', users)
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
    console.log('RUNNING AGAIN', room)
    handleUsersLayout(room?.users || [])
  }, [room])
  useEffect(() => {
    console.log(layout)
  }, [layout.top.length])
  const reveal = () => {
    const userRef = ref(db, `rooms/${roomId}`)
    update(userRef, {
      revealCards: true
    })
      .catch((error) => {
        console.error('Error updating card reveal: ', error)
      })

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
    <div className='flex flex-1 m-auto items-center'>
      {balls.map(ball => (
        <div
          key={ball.id}
          style={{
            position: 'absolute',
            left: ball.x,
            top: ball.y,
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
          }}
        >
          🏀
        </div>
      ))}

      <div className="table-module-container is-user-lonely" style={styles.container}>
        <div className="top" style={styles.top}>
          {!!layout.top.length &&
            layout.top.map((user) => (
              <button onClick={throwBallAtElement}>
                <Card user={user} flipped={cardsFlipped} flippable>
                  {user?.vote || ''}
                </Card>
              </button>
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
                        reveal()
                      }}
                    >
                      Reveal cards
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="bottom" style={styles.bottom}>
          {layout.bottom.map((user) => (
            <button onClick={throwBallAtElement}>

              <Card user={user} nameAlign="bottom" flipped={cardsFlipped} flippable>
                {user.vote}
              </Card>
            </button>
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
