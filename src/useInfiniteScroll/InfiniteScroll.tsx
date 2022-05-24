import React, {ChangeEvent, useRef, useState} from 'react'
import {Box, Container, TextField} from '@mui/material'
import ScrollContent from './ScrollContent'
import useInfiniteScroll from './useInfiniteScroll'

// InfiniteScroll component is the main gathering instance of infinite scroll. It combines hook usage
// with search bar and list of items
const InfiniteScroll = () => {

    const [text, setText] = useState<string>('')
    const [page, setPage] = useState<number>(1)

    const [isLastSeen, setIsLastSeenIndex] = useState<boolean>(false)
    const [isFirstSeen, setIsFirstSeenIndex] = useState<boolean>(false)

    // const observer = useRef<IntersectionObserver>()
    const lastSeenObserver = useRef<IntersectionObserver>()
    const firstSeenObserver = useRef<IntersectionObserver>()

    const {itemsInFocus, hasMore, loading, error, allItems, currentPosition} =
        useInfiniteScroll(text, page, setIsFirstSeenIndex, isFirstSeen, setIsLastSeenIndex, isLastSeen)

    // const lastInstanceRef = useCallback((node: HTMLLIElement | null) => {
    //     if (loading) return
    //     if (observer.current) observer.current.disconnect()
    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore && itemsInFocus[itemsInFocus.length - 1] === allItems[allItems.length - 1])
    //             setPage(prevState => prevState + 1)
    //     })
    //     if (node) observer.current.observe(node)
    // }, [loading, hasMore])

    const firstVisibleInstanceRef = (node: HTMLLIElement | null) => {
        if (loading) return
        if (firstSeenObserver.current) firstSeenObserver.current.disconnect()
        firstSeenObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting)
                setIsFirstSeenIndex(true)
        })
        if (node) firstSeenObserver.current.observe(node)
    }

    const lastVisibleInstanceRef = (node: HTMLLIElement | null) => {
        if (loading) return
        if (lastSeenObserver.current) lastSeenObserver.current.disconnect()
        lastSeenObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLastSeenIndex(true)
            }
        })
        if (node) lastSeenObserver.current.observe(node)
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(e.target.value)
        setPage(1)
    }

    return (
        <Container maxWidth='lg'>
            <Box display='flex' justifyContent='center' alignItems='center' py={3}>
                <TextField
                    sx={{minWidth: 300}}
                    label='Search for books...'
                    variant='standard'
                    value={text}
                    onChange={(e) => handleSearch(e)}
                />
            </Box>
            <ScrollContent
                error={error}
                loading={loading}
                itemsInFocus={itemsInFocus}
                lastVisibleInstanceRef={lastVisibleInstanceRef}
                firstVisibleInstanceRef={firstVisibleInstanceRef}
            />
        </Container>
    )
}

export default InfiniteScroll