import React, {useEffect, useState} from 'react'

interface IInfiniteScroll {
    style: React.CSSProperties
    children: Array<any>
}

const InfiniteScroll: React.FC<IInfiniteScroll> = ({style, children}) => {
    const containerRef = React.useRef<HTMLInputElement>(null)
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [renderIndex, setRenderIndex] = useState<number>(0)

    const rendered = 10
    const itemHeight = 50

    const items = children.map((child, i) =>
        <div
            key={child.props.index}
            style={{
                width: '100%',
                height: itemHeight,
                background: i % 2 === 0 ? 'lightgray' : 'white',
                position: 'absolute',
                left: 0,
                top: i === 0 ? 0 : i * itemHeight
            }}>
            {child}
        </div>)

    const [displayedItems, setDisplayedItems] = useState(() => {
        if (items.length > rendered) {
            return [...items.slice(0, rendered)]
        } else return items
    })

    // Attaches scroll event to the list, event handles scroll direction and position
    useEffect(() => {
        const onScroll = () => setCurrentPosition(!containerRef.current ? 0 : containerRef.current.scrollTop)

        containerRef.current?.addEventListener('scroll', onScroll)

        return () => containerRef.current?.removeEventListener('scroll', onScroll)
    }, [])

    // Change last renderIndex of visible items according to amount of scrolled pixels
    useEffect(() => {
        setRenderIndex(Math.floor(currentPosition / itemHeight))
    }, [currentPosition])

    // Add element at the end / beginning of list according to renderIndex
    useEffect(() => {
        setDisplayedItems(items.slice(renderIndex, rendered + renderIndex))
    }, [renderIndex])

    return (
        <div ref={containerRef}
             style={{
                 ...style,
                 border: '1px solid gray',
                 overflowY: 'scroll',
                 position: 'relative'
             }}
        >
            {displayedItems}
            <div style={{height: items.length * itemHeight}}/>
        </div>
    )
}

export default InfiniteScroll