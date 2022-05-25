import React, {useEffect, useMemo, useState} from 'react'
import useScrollPosition from './helpers/useScrollPosition'
import useWindowDimensions from './helpers/useWindowDimensions'

interface IResult {
    title: string
}

const useInfiniteScroll =
    (items: any[], setIsFirstItemSeen: Function, isFirstItemSeen: boolean, setIsLastItemSeen: Function, isLastItemSeen: boolean) => {

        const [itemsInFocus, setItemsInFocus] = useState<string[]>(items.slice(0, 20))

        const [firstSeenIndex, setFirstSeenIndex] = useState<number>(0)
        const [lastSeenIndex, setLastSeenIndex] = useState<number>(20)

        const {width, height} = useWindowDimensions()

        const defaultItemHeight = useMemo(() => {
            return height / itemsInFocus.length - 15
        }, [height, itemsInFocus.length])

        // Adds book to the top/bottom of the list, according to the given direction
        // Scrolls visible part of page to the exact amount of pixels above/beyond if
        // last element of list is seen
        const onItemsIndexChange = (direction: string) => {
            if (direction === 'top') {
                setFirstSeenIndex(prevState => prevState - 1)
            } else if (direction === 'bottom') {
                setLastSeenIndex(prevState => prevState + 1)
            }
        }

        const {currentPosition} =
            useScrollPosition(defaultItemHeight,isFirstItemSeen, setIsFirstItemSeen, isLastItemSeen, setIsLastItemSeen, onItemsIndexChange)

        useEffect(() => {
            console.log('Already scrolled: ', currentPosition)
        }, [currentPosition])

        // Adds book to the bottom of the list when the last is seen
        useEffect(() => {
            if (!itemsInFocus.length) return

            const updatedItems = (itemsInFocus.slice(1))
            updatedItems.push(items[lastSeenIndex])
            setItemsInFocus(updatedItems)
        }, [lastSeenIndex])


        // Adds book to the top of the list when first is seen
        useEffect(() => {
            if (!itemsInFocus.length) return

            const previousIndex = items.indexOf(itemsInFocus[0]) - 1 > 0 ? items.indexOf(itemsInFocus[0]) - 1 : 0
            let updatedItems = itemsInFocus.slice(0, 19)
            updatedItems = [items[previousIndex], ...updatedItems]
            setItemsInFocus(updatedItems)
        }, [firstSeenIndex])

        return {itemsInFocus}
    }

export default useInfiniteScroll