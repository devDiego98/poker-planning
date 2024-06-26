import ReactCardFlip from 'react-card-flip'

export default function Card({
  user,
  nameAlign = 'top',
  children,
  flipped = false,
  flippable = false
}: {
  user?: any
  nameAlign?: string
  children?: any
  flipped?: boolean
  flippable?: boolean
}) {
  const styles = {
    cardContainer: {
      display: 'flex',
      flexDirection: nameAlign == 'top' ? 'column' : 'column-reverse'
    },
    name: {
      textAlign: 'center'
    },
    card: {
      width: '50px',
      height: '100px',
      background: 'white',
      borderRadius: '5px',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
  return (
    <div style={styles.cardContainer} className={`card-container ${user?.name}`}>
      {user && (
        <div className="name" style={styles.name}>
          {user?.name}
        </div>
      )}

      {flippable ? (
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
          <div style={styles.card}>voting</div>
          <div style={styles.card}>test{!!children && children}</div>
        </ReactCardFlip>
      ) : (
        <div style={styles.card}>{children}</div>
      )}
    </div>
  )
}
