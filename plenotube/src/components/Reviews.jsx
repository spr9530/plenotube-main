import { Avatar } from '@heroui/avatar'
import React from 'react'
import Rating from './Rating'

function Reviews() {
    return (
        <div className='flex justify-between'>
            <div className='flex gap-2'>
                <Avatar
                    src='https://heroui.com/images/avatars/avatar-1.jpeg'
                    alt='Sparsh Manhas'
                    size='sm'
                />
                <div className='flex flex-col justify-center gap-1'>
                    <p className='font-semibold flex items-center mt-1 gap-3'>Sparsh Manhas
                        <span className='text-zinc-600 dark:text-zinc-500 text-xs font-medium'>
                            13 days
                        </span>
                    </p>
                    <Rating />
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Reviews