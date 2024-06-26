export default function UserCard({ user, nameAlign = 'top' }) {
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
      borderRadius: '5px'
    }
  }
  return (
    <div style={styles.cardContainer} className={`card-container ${user.name}`}>
      <div className="name" style={styles.name}>
        {user.name}
      </div>
      <div className="card" style={styles.card}></div>
    </div>
  )
}
