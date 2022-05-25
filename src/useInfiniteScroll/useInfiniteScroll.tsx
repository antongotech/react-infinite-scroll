import React, {useEffect, useMemo, useState} from 'react'
import useScrollPosition from './helpers/useScrollPosition'
import useWindowDimensions from './helpers/useWindowDimensions'
import useScreenScroll from './helpers/useScreenScroll'

interface IResult {
    title: string
}

const useInfiniteScroll =
    (items: any[], setIsFirstItemSeen: Function, isFirstItemSeen: boolean, setIsLastItemSeen: Function, isLastItemSeen: boolean) => {

        const {direction, currentPosition, resetPosition} = useScrollPosition()
        const {width, height} = useWindowDimensions()

        const [isFloorElement, setIsFloorElement] = useState(false)
        const [isCeilingElement, setIsCeilingElement] = useState(false)

        const [itemsInFocus, setItemsInFocus] = useState<string[]>(items.slice(0, 20))

        const [firstSeenIndex, setFirstSeenIndex] = useState<number>(0)
        const [lastSeenIndex, setLastSeenIndex] = useState<number>(20)

        const defaultItemHeight = useMemo(() => {
            return height / itemsInFocus.length
        }, [height, itemsInFocus.length])


        const onItemsIndexChange = (direction: string) => {
            if (direction === 'top') {
                setFirstSeenIndex(prevState => prevState - 1)
            } else if (direction === 'bottom') {
                setLastSeenIndex(prevState => prevState + 1)
            }
        }

        const {} = useScreenScroll(direction, currentPosition, isFloorElement, isCeilingElement, isFirstItemSeen, setIsFirstItemSeen, isLastItemSeen, setIsLastItemSeen, onItemsIndexChange, defaultItemHeight, resetPosition)

        //defaultItemHeight, isFloorElement, isCeilingElement, isFirstItemSeen, setIsFirstItemSeen, isLastItemSeen, setIsLastItemSeen, onItemsIndexChange

        useEffect(() => {
            if (itemsInFocus[0] === items[0]) {
                setIsFloorElement(true)
                return
            }
            if (itemsInFocus[itemsInFocus.length - 1] === items[items.length - 1]) {
                setIsCeilingElement(true)
                return
            }
            setIsFloorElement(false)
            setIsCeilingElement(false)
        }, [itemsInFocus])

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