import React, {useEffect, useState} from 'react'
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

        const [books, setBooks] = useState<string[]>([])
        const [itemsInFocus, setItemsInFocus] = useState<string[]>([])

        const [hasMore, setHasMore] = useState<boolean>(false)

        const [shouldSwap, setShouldSwap] = useState<number>(0)

        const [firstSeen, setFirstSeen] = useState<number>(0)
        const [lastSeen, setLastSeen] = useState<number>(20)

        const {width, height} = useWindowDimensions()
        const {direction, difference, currentPosition} = useScrollPosition()

        const setIsSeen = () => false

        const itemH = height / itemsInFocus.length - 15

        const onBookSwap = (direction: string) => {
            if (direction === 'up') {
                setFirstSeen(prevState => prevState - 1)
                if (firstSeenIndex) {
                    window.scrollTo(width, currentPosition + 100)
                    setIsFirstSeenIndex(false)
                }
            } else if (direction === 'down') {
                setLastSeen(prevState => prevState + 1)
                if (lastSeenIndex) {
                    window.scrollTo(width, currentPosition - 100)
                    setIsLastSeenIndex(false)
                }
            }
            console.log('Swap book, add to ', direction)
        }

        useEffect(() => {
            if (!itemsInFocus.length) return
            console.log('add to end', lastSeen)

            const newArr = itemsInFocus.slice(1)

            newArr.push(books[lastSeen])

            setItemsInFocus(newArr)

        }, [lastSeen])


        useEffect(() => {
            if (!itemsInFocus.length) return
            console.log('add to top', firstSeen)

            const ind = books.indexOf(itemsInFocus[0]) - 1 > 0 ? books.indexOf(itemsInFocus[0]) - 1 : 0
            console.log(ind)

            let newArr = itemsInFocus.slice(0, 19)

            newArr = [books[ind], ...newArr]

            setItemsInFocus(newArr)

        }, [firstSeen])

        useEffect(() => {
            // console.log(itemsInFocus)
        }, [itemsInFocus])

        useEffect(() => {
            setShouldSwap((prevState) => {
                // console.log(difference)
                if (prevState > itemH) {
                    onBookSwap(direction)
                    return 0
                } else {
                    return prevState += Math.abs(difference)
                }
            })
        }, [difference])

        useEffect(() => {
            setBooks([])
        }, [query])


        useEffect(() => {
            // console.log(books)
        }, [books])

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
                setBooks(prevState => [...prevState, ...res.data.docs.map((b: IResult) => b.title)])
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

        return {loading, error, itemsInFocus, hasMore, books, currentPosition}
    }

export default UseSearch