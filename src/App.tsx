import React, {CSSProperties} from 'react'
import InfiniteScroll from './InfiniteScroll/InfiniteScroll'

interface IRow {
    index: number
    style?: React.CSSProperties | undefined
    text?: string
}

const Row: React.FC<IRow> = ({index, style, text}) => {
    const overridenStyles: CSSProperties = {...style, textAlign: 'center', lineHeight: '50px'}
    return (
        <div style={overridenStyles}>Row {index}: {text}</div>
    )
}

function App() {

    const its = [{id: 1, text: 'Hey 1'}, {id: 2, text: 'Hey 2'}, {id: 3, text: 'Hey 3'}, {id: 4, text: 'Hey 4'},
        {id: 5, text: 'Hey 5'}, {id: 6, text: 'Hey 6'}, {id: 7, text: 'Hey 7'}, {id: 8, text: 'Hey 8'},
        {id: 9, text: 'Hey 9'}, {id: 10, text: 'Hey 10'}, {id: 11, text: 'Hey 11'}, {id: 12, text: 'Hey 12'},
        {id: 13, text: 'Hey 13'}, {id: 14, text: 'Hey 14'}, {id: 15, text: 'Hey 15'}, {id: 16, text: 'Hey 16'}]

    return (
        <>
            <h3 style={{textAlign: 'center'}}>Infinite scroll</h3>
            <InfiniteScroll style={{width: '100%', height: 250}}>
                {its.map(({id, text}) => <Row key={id} index={id} text={text}/>)}
            </InfiniteScroll>
        </>
    )
}

export default App