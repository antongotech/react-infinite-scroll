import {Box, Container, List, ListItem, ListItemText, TextField, Typography} from '@mui/material'
import React, {ChangeEvent, useState, useRef, useCallback} from 'react'
import useSearch from './useSearch'

function App() {
    const [text, setText] = useState<string>('')
    const [page, setPage] = useState<number>(1)

    const observer = useRef<IntersectionObserver>()
    const {books, hasMore, loading, error} = useSearch(text, page)

    const lastInstanceRef = useCallback((node: HTMLLIElement | null) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) setPage(prevState => prevState + 1)
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

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
                !error && books.length > 0 &&
                <List>
                    {books.map((b, i) => {
                        if (books.length === i + 1) {
                            return <ListItem ref={lastInstanceRef} key={b + i}><ListItemText
                                primary={`${i + 1}. ${b}`}/></ListItem>
                        } else {
                            return <ListItem key={b + i}><ListItemText primary={`${i + 1}. ${b}`}/></ListItem>
                        }
                    })}
                </List>
            }
            {
                loading && <Typography variant='body2' color='text.secondary'>Loading...</Typography>
            }
            {
                !loading && !books.length &&
                <Typography variant='body2' color='text.secondary'>Nothing has been found</Typography>
            }
        </Container>
    )
}

export default App