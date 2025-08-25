//componentes
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
//pages
//import Home from './pages/HomePage'

function App() {
  return (
    <>
      <Header />
      <Toaster position='top-right' />
      <Routes>
        <Route path='/' />
      </Routes>
      <Footer />
    </>
  )
}

export default App
