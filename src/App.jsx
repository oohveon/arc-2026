import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Intro from './pages/Intro.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Project from './pages/Project.jsx'
import MapPage from './pages/Map.jsx'
import Behind from './pages/Behind.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/behind" element={<Behind />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
