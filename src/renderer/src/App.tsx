import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import RevealCardsSection from './components/RevealCardsSection'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <RevealCardsSection />
      <Versions></Versions>
    </>
  )
}

export default App
