import React, {useEffect, useMemo, useState} from 'react'
import axios from 'axios'
import useWindowDimensions from './useInfiniteScroll/useWindowDimensions'
import useScrollPosition from './useInfiniteScroll/useScrollPosition'

interface IResult {
    title: string
}

const UseSearch =
    (query: string, page: number, setIsFirstSeenIndex: Function, firstSeenIndex: boolean, setIsLastSeenIndex: Function, lastSeenIndex: boolean) => {
        const [loading, setLoading] = useState<boolean>(true)
        const [error, setError] = useState<boolean>(false)

        const [allItems, setAllItems] = useState<string[]>([])
        const [itemsInFocus, setItemsInFocus] = useState<string[]>([])

        const [hasMore, setHasMore] = useState<boolean>(false)

        const [shouldSwap, setShouldSwap] = useState<number>(0)

        const [firstSeen, setFirstSeen] = useState<number>(0)
        const [lastSeen, setLastSeen] = useState<number>(20)

        const {width, height} = useWindowDimensions()

        const defaultItemHeight = useMemo(() => {
            return height / itemsInFocus.length - 15
        }, [height, itemsInFocus.length])

        const {direction, difference, currentPosition} = useScrollPosition()

        // Adds book to the top/bottom of the list, according to the given direction
        // Scrolls visible part of page to the exact amount of pixels above/beyond if
        // last element of list is seen
        const onBookSwap = (direction: string) => {
            console.log(direction)
            if (direction === 'top') {
                console.log('top check')
                setFirstSeen(prevState => prevState - 1)
                if (firstSeenIndex) {
                    window.scrollTo(width, currentPosition + 100)
                    setIsFirstSeenIndex(false)
                }
            } else if (direction === 'bottom') {
                console.log('bot check')
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
            newArr.push(allItems[lastSeen])
            setItemsInFocus(newArr)
        }, [lastSeen])

        // Adds book to the top of the list when first is seen
        useEffect(() => {
            if (!itemsInFocus.length) return

            console.log('Added to top', firstSeen)
            const previousIndex = allItems.indexOf(itemsInFocus[0]) - 1 > 0 ? allItems.indexOf(itemsInFocus[0]) - 1 : 0
            let updatedItems = itemsInFocus.slice(0, 19)
            updatedItems = [allItems[previousIndex], ...updatedItems]
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

        // Clears items array if query changes
        useEffect(() => {
            setAllItems([])
        }, [query])

        // Async useEffect for fetching data from api
        useEffect(() => {
            setLoading(true)
            setError(false)

            let cancel: Function

            axios({
                method: 'GET',
                url: 'http://openlibrary.org/search.json',
                params: {q: query, page: page},
                cancelToken: new axios.CancelToken((c) => cancel = c)
            }).then((res) => {
                setAllItems(prevState => [...prevState, ...res.data.docs.map((b: IResult) => b.title)])
                if (!itemsInFocus.length && res.data.docs.length) {
                    console.log('init fill')
                    const newArr = res.data.docs.slice(0, 20)
                    setItemsInFocus([...newArr.map((b: IResult, i: number) => i < 20 && b.title)])
                }
                setHasMore(res.data.docs.length > 0)
                setLoading(false)
            }).catch(e => {
                if (axios.isCancel(e)) return
                setError(true)
            })

            return () => cancel()
        }, [query, page])

        return {loading, error, itemsInFocus, hasMore, allItems, currentPosition}
    }

export default UseSearch