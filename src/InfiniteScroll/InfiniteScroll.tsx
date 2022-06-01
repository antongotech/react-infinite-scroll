import React, {useEffect, useMemo, useRef, useState} from 'react'

interface IInfiniteScroll {
    style: React.CSSProperties
    children: Array<any>
}

const InfiniteScroll: React.FC<IInfiniteScroll> = ({style, children}) => {
    const containerRef = useRef<HTMLInputElement>(null)
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [renderIndex, setRenderIndex] = useState<number>(0)
    const renderedItems = useMemo(() => 10, [])
    const itemsHeight: number[] = useMemo(() => [], [])

    const items = useMemo(() => {
        return children.map((child, i) => {
            itemsHeight.push(child.props.height || 50)
            const itemPosition = itemsHeight.reduce((acc, next) => acc += next) - itemsHeight[i]
            return (
                <div
                    key={child.props.index}
                    style={{
                        width: '100%',
                        height: itemsHeight[i],
                        background: i % 2 === 0 ? 'lightgray' : 'white',
                        position: 'absolute',
                        left: 0,
                        top: i === 0 ? 0 : itemPosition,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {child}
                </div>
            )
        })
    }, [children])

    const averageItemHeight = useMemo(() => itemsHeight.reduce((acc, curr) => acc += curr) / items.length, [])

    const [displayedItems, setDisplayedItems] = useState(() => {
        if (items.length > renderedItems) {
            return [...items.slice(0, renderedItems)]
        } else return items
    })

    useEffect(() => {
        const onScroll = () => setCurrentPosition(!containerRef.current ? 0 : containerRef.current.scrollTop)
        containerRef.current?.addEventListener('scroll', onScroll)
        return () => containerRef.current?.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (renderIndex === Math.floor(currentPosition / averageItemHeight)) return
        setRenderIndex(Math.floor(currentPosition / averageItemHeight))
    }, [currentPosition])

    useEffect(() => {
        setDisplayedItems(items.slice(renderIndex, renderedItems + renderIndex))
    }, [renderIndex])

    return (
        <div ref={containerRef}
             style={{
                 ...style,
                 border: '1px solid gray',
                 overflowY: 'scroll',
                 position: 'relative',
             }}
        >
            {displayedItems}
            <div style={{height: items.length * averageItemHeight}}/>
        </div>
    )
}

export default InfiniteScroll