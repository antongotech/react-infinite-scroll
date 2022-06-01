import React, {useEffect, useMemo, useRef, useState} from 'react'

interface IInfiniteScroll {
    style: React.CSSProperties
    children: Array<any>
}

const renderedItems = 10

const InfiniteScroll: React.FC<IInfiniteScroll> = ({style, children}) => {
    const containerRef = useRef<HTMLInputElement>(null)
    const [renderIndex, setRenderIndex] = useState<number>(0)
    const ref = useRef<number[]>()
    if (!ref.current) {
        ref.current = []
    }
    const itemsHeight = ref.current

    const items = useMemo(() => {
        return React.Children.map(children, (child, i) => {
            itemsHeight.push(child.props.height || 50)
            const itemPosition = itemsHeight.reduce((acc, next) => acc += next) - itemsHeight[i]
            return (
                <div
                    key={child.props.elementId}
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
        const onScroll = () => {
            const currentPosition = !containerRef.current ? 0 : containerRef.current.scrollTop
            setRenderIndex(Math.floor(currentPosition / averageItemHeight))
        }
        containerRef.current?.addEventListener('scroll', onScroll)
        return () => containerRef.current?.removeEventListener('scroll', onScroll)
    }, [])

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