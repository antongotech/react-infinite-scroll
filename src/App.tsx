import React from 'react'
import InfiniteScroll from './InfiniteScroll/InfiniteScroll'

interface IRow {
    elementId: number
    index: number
    style?: React.CSSProperties | undefined
    text?: string
    height?: number
}

interface IItem {
    id: number
    text: string
    height?: number
}

const Row: React.FC<IRow> = ({index, text}) => <div>Row {index}: {text}</div>

function App() {
    let data: IItem[] = []
    for (let i = 0; i < 100; i++) {
        data.push({id: i, text: `Hey ${i}`, height: Math.max(5, Math.round(Math.random() * 30)) * 10})
    }

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll style={{width: '100%', height: 250}}>
                {data.map(({id, text, height}) => <Row key={id} elementId={id} index={id} text={text} height={height}/>)}
            </InfiniteScroll>
        </>
    )
}

export default App