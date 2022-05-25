import React, {useEffect, useState} from 'react'

// useScrollPosition is a helper hook returns numeric value that represents current position of viewport on Y-axis,
// direction where page is scrolled(top/bottom), difference in pixels from last scroll value resetting
const useScrollPosition =
    (itemHeight: number, isFirstItemSeen: boolean, setIsFirstItemSeen: Function, isLastItemSeen: boolean, setIsLastItemSeen: Function, onItemsIndexChange: Function) => {

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

        const checkPosition = () => {
            if (direction === 'top') {
                if (isFirstItemSeen && currentPosition > 0) {
                    onItemsIndexChange('top')
                    window.scrollTo(0, currentPosition + (itemHeight * 3))
                    setCurrentPosition(0)
                    setIsFirstItemSeen(false)
                }

            } else if (direction === 'bottom') {
                if (isLastItemSeen) {
                    onItemsIndexChange('bottom')
                    window.scrollTo(0, currentPosition - (itemHeight * 3))
                    setCurrentPosition(0)
                    setIsLastItemSeen(false)
                }
            }
        }

        useEffect(() => {
            checkPosition()
        }, [currentPosition])

        return {currentPosition}
    }

export default useScrollPosition