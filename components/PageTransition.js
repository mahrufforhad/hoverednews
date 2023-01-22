import { useEffect } from 'react'

export default function PageTransition(setShowPageTransition) {
  useEffect(() => {
    setTimeout(() => {
      setShowPageTransition(true)
    }, 0)
    setTimeout(() => {
      setShowPageTransition(false)
    }, 400)
    setTimeout(() => {
      setShowPageTransition('hide')
    }, 800)
  }, [])
}
