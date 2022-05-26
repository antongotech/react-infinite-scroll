import React, {useEffect, useRef, useState} from 'react'
import {Container} from '@mui/material'
import ScrollContent from './ScrollContent'
import useInfiniteScroll from './useInfiniteScroll'

const InfiniteScroll: React.FC<{ items: any[] }> = ({items}) => {

    const [isLastItemSeen, setIsLastItemSeen] = useState<boolean>(false)
    const [isFirstItemSeen, setIsFirstItemSeen] = useState<boolean>(false)


    useEffect(() => {
        isFirstItemSeen && setIsLastItemSeen(false)
        isLastItemSeen && setIsFirstItemSeen(false)
    }, [isFirstItemSeen, isLastItemSeen])

    const lastSeenObserver = useRef<IntersectionObserver>()
    const firstSeenObserver = useRef<IntersectionObserver>()

    const {itemsInFocus} = useInfiniteScroll(items, setIsFirstItemSeen, isFirstItemSeen, setIsLastItemSeen, isLastItemSeen)

    // Controls boolean state that represents visibility of first element
    const firstVisibleInstanceRef = (node: HTMLLIElement | null) => {
        if (firstSeenObserver.current) firstSeenObserver.current.disconnect()
        firstSeenObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting)
                setIsFirstItemSeen(true)
        })
        if (node) firstSeenObserver.current.observe(node)
    }

    // Controls boolean state that represents visibility of last element
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