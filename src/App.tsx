import React from 'react'
import InfiniteScroll from './InfiniteScroll/InfiniteScroll'

interface IRow {
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

const Row: React.FC<IRow> = ({index, style, text}) => <div>Row {index}: {text}</div>

function App() {

    const data: IItem[] = [{id: 1, text: 'Hey 1', height: 100}, {id: 2, text: 'Hey 2', height: 200},
        {id: 3, text: 'Hey 3', height: 25}, {id: 4, text: 'Hey 4', height: 75},
        {id: 5, text: 'Hey 5', height: 20}, {id: 6, text: 'Hey 6', height: 300},
        {id: 7, text: 'Hey 7'}, {id: 8, text: 'Hey 8'}, {id: 9, text: 'Hey 9'},
        {id: 10, text: 'Hey 10'}, {id: 11, text: 'Hey 11', height: 150},
        {id: 12, text: 'Hey 12'}, {id: 13, text: 'Hey 13'}, {id: 14, text: 'Hey 14'},
        {id: 15, text: 'Hey 15'}, {id: 16, text: 'Hey 16', height: 500}]

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll style={{width: '100%', height: 250}}>
                {data.map(({id, text, height}) => <Row key={id} index={id} text={text} height={height}/>)}
            </InfiniteScroll>
        </>
    )
}

export default App