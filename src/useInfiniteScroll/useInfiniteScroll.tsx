import React, {useEffect, useMemo, useState} from 'react'
import useScrollPosition from './helpers/useScrollPosition'
import useWindowDimensions from './helpers/useWindowDimensions'
import useScreenScroll from './helpers/useScreenScroll'
import useGetEdgeElements from "./helpers/useGetEdgeElements";

const useInfiniteScroll =
    (items: any[], setIsFirstItemSeen: Function, isFirstItemSeen: boolean, setIsLastItemSeen: Function, isLastItemSeen: boolean) => {

        const {direction, currentPosition, resetPosition} = useScrollPosition()
        const {height} = useWindowDimensions()

        const [itemsInFocus, setItemsInFocus] = useState<string[]>(items.slice(0, 20))

        const {isFloorElement, isCeilingElement} = useGetEdgeElements(items, itemsInFocus)

        const [firstSeenIndex, setFirstSeenIndex] = useState<number>(0)
        const [lastSeenIndex, setLastSeenIndex] = useState<number>(20)

        const defaultItemHeight = useMemo(() => {
            return height / itemsInFocus.length
        }, [height, itemsInFocus.length])

        // Controls indexes of visible part of elements array
        const onItemsIndexChange = (direction: string) => {
            if (direction === 'top') {
                setFirstSeenIndex(prevState => prevState - 1)
            } else if (direction === 'bottom') {
                setLastSeenIndex(prevState => prevState + 1)
            }
        }

        useScreenScroll(direction, currentPosition, isFloorElement, isCeilingElement, isFirstItemSeen, setIsFirstItemSeen, isLastItemSeen, setIsLastItemSeen, onItemsIndexChange, defaultItemHeight, resetPosition)

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