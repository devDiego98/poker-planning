import { useEffect, useState } from 'react'
import Card from './Card'

export default function RevealCardsSection() {
  const [users, setUsers] = useState([
    {
      name: 'diego',
      id: ''
    },
    {
      name: 'dgk'
    },
    {
      name: 'mariana'
    },
    {
      name: 'juli'
    },
    {
      name: 'ippo'
    },
    {
      name: 'leonardo'
    },
    {
      name: 'javi'
    },
    {
      name: 'nati'
    },
    {
      name: 'leonel'
    },
    {
      name: 'cyn'
    }
  ])
  const [cardsFlipped, setCardsFlipped] = useState(false)
  const [layout, setLayout] = useState({
    top: [],
    bottom: []
  })
  const handleUsersLayout = (users, setUsers) => {
    // Calculate the midpoint
    const midpoint = Math.ceil(users.length / 2)

    // Split the array into two halves
    const firstHalf = users.slice(0, midpoint)
    const secondHalf = users.slice(midpoint)
    console.log(firstHalf, secondHalf)

    setLayout({
      top: [...(firstHalf as [])],
      bottom: [...(secondHalf as [])]
    })
  }
  useEffect(() => {
    handleUsersLayout(users, setUsers)
  }, [users.length])
  useEffect(() => {
    console.log(layout)
  }, [layout.top.length])
  return (
    <div className="table-module-container is-user-lonely" style={styles.container}>
      <div className="top" style={styles.top}>
        {layout.top.map((user) => (
          <Card user={user} flipped={cardsFlipped} flippable>
            {user.name}
          </Card>
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
                      setCardsFlipped(!cardsFlipped)
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
          <Card user={user} nameAlign="bottom" flipped={cardsFlipped} flippable>
            {user.name}
          </Card>
        ))}
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
