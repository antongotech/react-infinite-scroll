import React, {useEffect, useState} from 'react'

// useScrollPosition is a helper hook returns numeric value that represents current position of viewport on Y-axis,
// direction where page is scrolled(top/bottom), difference in pixels from last scroll value resetting
const useScrollPosition = () => {

    const [direction, setDirection] = useState<string>('frozen')
    const [difference, setDifference] = useState<number>(0)

    const [prevPosition, setPrevPosition] = useState<number>(0)
    const [currentPosition, setCurrentPosition] = useState<number>(0)

    useEffect(() => {
        const onScroll = () => setCurrentPosition(prevState => {
            setPrevPosition(prevState)
            setDirection(prevState > window.pageYOffset ? 'top' : 'bottom')
            return window.pageYOffset
        })
        window.removeEventListener('scroll', onScroll)
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setDifference(() => {
            if (direction === 'top') {
                return currentPosition - prevPosition
            } else if (direction === 'bottom') {
                return prevPosition - currentPosition
            } else {
                return 0
            }
        })
    }, [currentPosition])

    return {currentPosition, direction, difference}
}

export default useScrollPosition