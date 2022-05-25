import React, {useEffect, useMemo, useState} from 'react'
import useScrollPosition from './helpers/useScrollPosition'
import useWindowDimensions from './helpers/useWindowDimensions'

interface IResult {
    title: string
}

const useInfiniteScroll =
    (items: any[], setIsFirstSeenIndex: Function, firstSeenIndex: boolean, setIsLastSeenIndex: Function, lastSeenIndex: boolean) => {

        const [itemsInFocus, setItemsInFocus] = useState<string[]>(items.slice(0, 20))

        const [shouldSwap, setShouldSwap] = useState<number>(0)

        const [firstSeen, setFirstSeen] = useState<number>(0)
        const [lastSeen, setLastSeen] = useState<number>(20)


        const {width, height} = useWindowDimensions()
        const {direction, difference, currentPosition} = useScrollPosition()

        const defaultItemHeight = useMemo(() => {
            return height / itemsInFocus.length - 15
        }, [height, itemsInFocus.length])


        // Adds book to the top/bottom of the list, according to the given direction
        // Scrolls visible part of page to the exact amount of pixels above/beyond if
        // last element of list is seen
        const onBookSwap = (direction: string) => {
            console.log('Scrolling to ', direction)
            if (direction === 'top') {
                setFirstSeen(prevState => prevState - 1)
                if (firstSeenIndex) {
                    window.scrollTo(width, currentPosition + 100)
                    setIsFirstSeenIndex(false)
                }
            } else if (direction === 'bottom') {
                setLastSeen(prevState => prevState + 1)
                if (lastSeenIndex) {
                    window.scrollTo(width, currentPosition - 100)
                    setIsLastSeenIndex(false)
                }
            }
            console.log('Book has been swapped, new one added to ', direction)
        }


        // Adds book to the bottom of the list when the last is seen
        useEffect(() => {
            if (!itemsInFocus.length) return

            console.log('Added to the bottom', lastSeen)
            const newArr = itemsInFocus.slice(1)
            newArr.push(items[lastSeen])
            setItemsInFocus(newArr)
        }, [lastSeen])


        // Adds book to the top of the list when first is seen
        useEffect(() => {
            if (!itemsInFocus.length) return

            console.log('Added to top', firstSeen)
            const previousIndex = items.indexOf(itemsInFocus[0]) - 1 > 0 ? items.indexOf(itemsInFocus[0]) - 1 : 0
            let updatedItems = itemsInFocus.slice(0, 19)
            updatedItems = [items[previousIndex], ...updatedItems]
            setItemsInFocus(updatedItems)
        }, [firstSeen])


        // Controls amount of scrolled pixels, if value is more that average
        // height of one item, it calls a function that adds element to the start/end of the list
        useEffect(() => {
            setShouldSwap((prevState) => {
                if (prevState > defaultItemHeight) {
                    onBookSwap(direction)
                    return 0
                } else {
                    return prevState += Math.abs(difference)
                }
            })
        }, [difference])

        return {itemsInFocus}
    }

export default useInfiniteScroll