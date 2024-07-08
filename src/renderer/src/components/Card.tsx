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
      flexDirection:
        nameAlign == 'top' ? 'column' : ('column-reverse' as 'column' | 'column-reverse')
    },
    name: {
      textAlign: 'center' as 'center'
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
      alignItems: 'center',
      margin: 'auto'
    }
  }
  return (
    <div style={styles.cardContainer} className={`card-container ${user?.name}`}>
      {user && (
        <div className="name flex justify-center" style={styles.name}>
          {user?.email}
        </div>
      )}

      {flippable ? (
        <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
          <div style={styles.card}>voting</div>
          <div style={styles.card}>{!!children && children}</div>
        </ReactCardFlip>
      ) : (
        <div style={styles.card}>{children}</div>
      )}
    </div>
  )
}
