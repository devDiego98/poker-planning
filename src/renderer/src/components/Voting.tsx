import Card from './Card'

export default function Voting() {
  const fibonacciSequence = ['1', '2', '3', '5', '8', '13', '21', '34', '55']
  return (
    <div style={styles.container}>
      {fibonacciSequence.map((item) => (
        <Card>{item}</Card>
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
