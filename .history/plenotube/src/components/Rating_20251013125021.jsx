import React from 'react'
import { FaStar } from "react-icons/fa";

function Rating() {
  return (
    <div className='flex gap-0.5'>
      <FaStar className='text-yellow-400'/>
      <FaStar className='text-yellow-400'/>
      <FaStar className='text-yellow-400'/>
      <FaStar className='text-yellow-400'/>
      <FaStar className='text-yellow-400'/>
    </div>
  )
}

export default Rating