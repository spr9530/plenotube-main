import React from 'react'
import Rating from './Rating'
import { FaStar } from 'react-icons/fa'

function ReviewCount() {
  return (
    <div className='flex flex-col  gap-4 w-full'>
        <div className='flex flex-col gap-2'>
            <div className='flex gap-3 items-center'>
                <Rating />
                <span className='font-semibold text-md'>4.28 Out Of 5</span>
            </div>
            <span className='text-zinc-400 text-sm'>190 total reviews</span>
        </div>
        <div className='flex flex-col gap-1 w-full'>
            <div className='flex gap-2 items-center'>
                <span className='flex gap-2 items-center'>5 <FaStar className='text-yellow-400'/></span>
                <div className='w-full bg-zinc-700 h-2 rounded-full overflow-hidden'>
                    <div className='bg-yellow-400 h-2 w-[80%] rounded-full'></div>
                </div>
            </div>
              <div className='flex gap-2 items-center'>
                <span className='flex gap-2 items-center'>4 <FaStar className='text-yellow-400'/></span>
                <div className='w-full bg-zinc-700 h-2 rounded-full overflow-hidden'>
                    <div className='bg-yellow-400 h-2 w-[60%] rounded-full'></div>
                </div>
            </div>
             <div className='flex gap-2 items-center'>
                <span className='flex gap-2 items-center'>3 <FaStar className='text-yellow-400'/></span>
                <div className='w-full bg-zinc-700 h-2 rounded-full overflow-hidden'>
                    <div className='bg-yellow-400 h-2 w-[30%] rounded-full'></div>
                </div>
            </div>
             <div className='flex gap-2 items-center'>
                <span className='flex gap-2 items-center'>2 <FaStar className='text-yellow-400'/></span>
                <div className='w-full bg-zinc-700 h-2 rounded-full overflow-hidden'>
                    <div className='bg-yellow-400 h-2 w-[10%] rounded-full'></div>
                </div>
            </div>
             <div className='flex gap-2 items-center'>
                <span className='flex gap-2 items-center'>1 <FaStar className='text-yellow-400'/></span>
                <div className='w-full bg-zinc-700 h-2 rounded-full overflow-hidden'>
                    <div className='bg-yellow-400 h-2 w-[10%] rounded-full'></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReviewCount