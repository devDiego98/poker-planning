import RevealCardsSection from './components/RevealCardsSection'
import Voting from './components/Voting'

function App(): JSX.Element {
  const styles = {
    layout: {
      display: 'flex',
      flexDirection: 'column',
      gap: '64px'
    }
  }
  return (
    <div style={styles.layout}>
      <RevealCardsSection />
      <Voting />
    </div>
  )
}

export default App
