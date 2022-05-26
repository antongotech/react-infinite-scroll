import React, {useEffect, useState} from 'react'

// useScrollPosition returns current position of screen, direction and fn to reset position
const useScrollPosition = () => {
    const [direction, setDirection] = useState<string>('frozen')
    const [currentPosition, setCurrentPosition] = useState<number>(0)

    useEffect(() => {
        const onScroll = () => setCurrentPosition(prevState => {
            setDirection(prevState > window.pageYOffset ? 'top' : 'bottom')
            return window.pageYOffset
        })
        window.removeEventListener('scroll', onScroll)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const resetPosition = () => {
        setCurrentPosition(1)
    }

    return {direction, currentPosition, resetPosition}
}

export default useScrollPosition