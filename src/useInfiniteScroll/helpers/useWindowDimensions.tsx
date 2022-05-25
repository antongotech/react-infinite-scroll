import React, {useEffect, useState} from 'react'

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window
    return {width, height}
}

// useWindowDimensions is a helper hook that returns current screen solution in real time
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions)

    useEffect(() => {
        const handleResize = () => setWindowDimensions(getWindowDimensions)
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}

export default useWindowDimensions