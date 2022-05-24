import {Box, Container, List, ListItem, ListItemText, TextField, Typography} from '@mui/material'
import React, {ChangeEvent, useState, useRef, useCallback, useEffect} from 'react'
import useSearch from './useSearch'

function App() {
    const [text, setText] = useState<string>('')
    const [page, setPage] = useState<number>(1)

    const [isLastSeen, setIsLastSeenIndex] = useState<boolean>(false)
    const [isFirstSeen, setIsFirstSeenIndex] = useState<boolean>(false)

    // const observer = useRef<IntersectionObserver>()
    const lastSeenObserver = useRef<IntersectionObserver>()
    const firstSeenObserver = useRef<IntersectionObserver>()

    const {itemsInFocus, hasMore, loading, error, allItems, currentPosition} =
        useSearch(text, page, setIsFirstSeenIndex, isFirstSeen, setIsLastSeenIndex, isLastSeen,)

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
                <TextField sx={{minWidth: 300}} id="standard-basic" label="Search for books..." variant="standard"
                           value={text}
                           onChange={(e) => handleSearch(e)}/>
            </Box>
            {
                error && <Typography variant='body2' color='text.secondary'>Error. Please reload the page</Typography>
            }
            {
                !error && itemsInFocus.length > 0 &&
                <List>
                    {itemsInFocus.map((b, i) => {
                        if (itemsInFocus.length === i + 1) {
                            return <ListItem sx={{margin: '5px 0'}} ref={lastVisibleInstanceRef}
                                             key={b + i}><ListItemText
                                primary={`${i + 1}. ${b}`}/></ListItem>
                        } else if (i === 0) {
                            return <ListItem sx={{margin: '5px 0'}} ref={firstVisibleInstanceRef}
                                             key={b + i}><ListItemText
                                primary={`${i + 1}. ${b}`}/></ListItem>
                        } else {
                            return <ListItem sx={{margin: '5px 0'}} key={b + i}><ListItemText
                                primary={`${i + 1}. ${b}`}/></ListItem>
                        }
                    })}
                </List>
            }
            {
                loading && <Typography variant='body2' color='text.secondary'>Loading...</Typography>
            }
            {
                !loading && !itemsInFocus.length &&
                <Typography variant='body2' color='text.secondary'>Nothing has been found</Typography>
            }
        </Container>
    )
}

export default App