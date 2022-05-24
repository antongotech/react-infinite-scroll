import React from 'react'
import {List, ListItem, ListItemText, Typography} from '@mui/material'

interface IScrollContent {
    error: boolean
    loading: boolean
    itemsInFocus: string[]
    firstVisibleInstanceRef: any
    lastVisibleInstanceRef: any
}

const ScrollContent: React.FC<IScrollContent> =
    ({error, loading, lastVisibleInstanceRef, firstVisibleInstanceRef, itemsInFocus}) => {
        if (error) return <Typography variant='body2' color='text.secondary'>Error. Please reload the page</Typography>
        else if (!error && itemsInFocus.length > 0) return (
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
        )
        else if (loading) return <Typography variant='body2' color='text.secondary'>Loading...</Typography>
        else return <Typography variant='body2' color='text.secondary'>Nothing has been found</Typography>
    }

export default ScrollContent