import React from 'react'
import {RotatingSquare} from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <RotatingSquare
        height="100"
        width="100"
        color="#ff9a9e"
        ariaLabel="rotating-square-loading"
        strokeWidth="4"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        />
        <h2>Generating Results...</h2>
    </div>
)
}

export default Loader