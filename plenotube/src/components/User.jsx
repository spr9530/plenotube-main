import { Avatar } from '@heroui/avatar'
import React from 'react'

function UserProfile() {
    return (
        <div className='flex gap-2'>
            <Avatar
                src='https://heroui.com/images/avatars/avatar-1.jpeg'
                alt='Sparsh Manhas'
                size='sm'
            />
            <div className='flex flex-col justify-center'>
                <p className='font-semibold'>Sparsh Manhas</p>
                <p className='text-zinc-600 dark:text-zinc-400 text-sm'>@sparhmanhas111</p>
            </div>
        </div>
    )
}

export default UserProfile