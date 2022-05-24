import React, {useEffect, useState} from 'react'

// useScrollPosition returns numeric value that represents current position of viewport on Y-axis
const useScrollPosition = () => {

    const [direction, setDirection] = useState<string>('frozen')
    const [difference, setDifference] = useState<number>(0)

    const [prevPosition, setPrevPosition] = useState<number>(0)
    const [currentPosition, setCurrentPosition] = useState<number>(0)

    useEffect(() => {
        const onScroll = () => setCurrentPosition(prevState => {
            setPrevPosition(prevState)
            setDirection(prevState > window.pageYOffset ? 'up' : 'down')
            return window.pageYOffset
        })
        window.removeEventListener('scroll', onScroll)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setDifference(() => {
            if (direction === 'up') {
                return currentPosition - prevPosition
            } else if (direction === 'down') {
                return prevPosition - currentPosition
            } else {
                return 0
            }
        })
    }, [currentPosition])

    return {currentPosition, direction, difference}
}

export default useScrollPosition