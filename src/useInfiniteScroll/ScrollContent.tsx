import React from 'react'
import {List, ListItem, ListItemText} from '@mui/material'

interface IScrollContent {
    itemsInFocus: string[]
    firstVisibleInstanceRef: any
    lastVisibleInstanceRef: any
}

const ScrollContent: React.FC<IScrollContent> =
    ({itemsInFocus, lastVisibleInstanceRef, firstVisibleInstanceRef}) => {
        return (
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
    }

export default ScrollContent