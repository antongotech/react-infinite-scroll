import React, {useEffect, useMemo, useState} from 'react'

interface IInfiniteScroll {
    height: number
    width: number
    amount: number
    Item: any
}

const InfiniteScroll: React.FC<IInfiniteScroll> = ({height, width, amount, Item}) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [index, setIndex] = useState<number>(0)

    const itemHeight = 50
    const lastIndex = 10

    const items = useMemo(() => {
        let temp = []
        for (let i = amount; i > 0; i--) {
            temp.push(
                <Item
                    key={i}
                    index={i}
                    style={{
                        width: '100%',
                        height: itemHeight,
                        background: i % 2 === 0 ? 'lightgray' : 'white',
                        position: 'absolute',
                        left: 0,
                        top: i === 1 ? 0 : i * itemHeight - itemHeight
                    }}/>
            )
        }
        return temp.reverse()
    }, [amount, Item, itemHeight])

    const [inFocus, setInFocus] = useState(() => {
        if (items.length > lastIndex) {
            return [...items.slice(0, lastIndex)]
        } else return items
    })

    // Attaches scroll event to the list, event handles scroll direction and position
    useEffect(() => {
        const onScroll = () => setCurrentPosition(!inputRef.current ? 0 : inputRef.current.scrollTop)

        inputRef.current?.addEventListener('scroll', onScroll)

        return () => inputRef.current?.removeEventListener('scroll', onScroll)
    }, [])

    // Change last index of visible items according to amount of scrolled pixels
    useEffect(() => {
        setIndex(Math.floor(currentPosition / itemHeight))
    }, [currentPosition])

    // Add element at the end / beginning of list according to index
    useEffect(() => {
        setInFocus(prev => {
            if (items.length > lastIndex) {
                return items.slice(index, lastIndex + index)
            } else return prev
        })
    }, [index])

    return (
        <div ref={inputRef} style={{
            width: width,
            height: height,
            border: '1px solid gray',
            overflowY: 'scroll',
            position: 'relative'
        }}>
            {inFocus}
            <div style={{height: items.length * itemHeight}}/>
        </div>
    )
}

export default InfiniteScroll