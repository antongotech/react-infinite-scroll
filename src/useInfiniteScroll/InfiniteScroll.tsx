import React, {ChangeEvent, useRef, useState} from 'react'
import {Container} from '@mui/material'
import ScrollContent from './ScrollContent'
import useInfiniteScroll from './useInfiniteScroll'

// InfiniteScroll component is the main gathering instance of infinite scroll. It combines hook usage
// with search bar and list of items

const InfiniteScroll: React.FC<{ items: any[] }> = ({items}) => {

    const [isLastItemSeen, setIsLastItemSeen] = useState<boolean>(false)
    const [isFirstItemSeen, setIsFirstItemSeen] = useState<boolean>(false)

    const lastSeenObserver = useRef<IntersectionObserver>()
    const firstSeenObserver = useRef<IntersectionObserver>()

    const {itemsInFocus} = useInfiniteScroll(items, setIsFirstItemSeen, isFirstItemSeen, setIsLastItemSeen, isLastItemSeen)

    const firstVisibleInstanceRef = (node: HTMLLIElement | null) => {
        if (firstSeenObserver.current) firstSeenObserver.current.disconnect()
        firstSeenObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting)
                setIsFirstItemSeen(true)
        })
        if (node) firstSeenObserver.current.observe(node)
    }

    const lastVisibleInstanceRef = (node: HTMLLIElement | null) => {
        if (lastSeenObserver.current) lastSeenObserver.current.disconnect()
        lastSeenObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLastItemSeen(true)
            }
        })
        if (node) lastSeenObserver.current.observe(node)
    }

    return (
        <Container maxWidth='lg'>
            <ScrollContent
                itemsInFocus={itemsInFocus}
                lastVisibleInstanceRef={lastVisibleInstanceRef}
                firstVisibleInstanceRef={firstVisibleInstanceRef}
            />
        </Container>
    )
}

export default InfiniteScroll