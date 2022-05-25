import React, {useEffect} from 'react'

const useScreenScroll = (direction: string, currentPosition: number, isFloor: boolean, isCeiling: boolean, isFirstItemSeen: boolean, setIsFirstItemSeen: Function, isLastItemSeen: boolean, setIsLastItemSeen: Function, onItemsIndexChange: Function, itemHeight: number, resetPosition: Function) => {

    const checkPosition = () => {
        if (direction === 'top') {
            if (isFirstItemSeen && currentPosition > 0 && !isFloor) {
                onItemsIndexChange('top')
                window.scrollTo(0, currentPosition + (itemHeight * 3))
                resetPosition()
                setIsFirstItemSeen(false)
            }

        } else if (direction === 'bottom') {
            if (isLastItemSeen && !isCeiling) {
                onItemsIndexChange('bottom')
                window.scrollTo(0, currentPosition - (itemHeight * 3))
                resetPosition()
                setIsLastItemSeen(false)
            }
        }
    }

    useEffect(() => {
        checkPosition()
    }, [currentPosition])

    return {}
}

export default useScreenScroll