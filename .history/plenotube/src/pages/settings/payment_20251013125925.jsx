import React from 'react'
import SettingLayout from '../../layouts/settingLayout'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button } from '@heroui/button';

function Payment() {
    return (
        <SettingLayout>
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Payment Methods</div>
                <div className='bg-dark1 border border-zinc-800 rounded-xl p-8 gap-2 flex justify-center items-center '>
                    <span><IoMdInformationCircleOutline className='text-2xl' /></span>No Payment Methods Found
                </div>
            </div>

            <div className='w-full flex justify-end p-2'>
                <Button variant='solid' color='primary'>Add New Method</Button>
            </div>

        </SettingLayout>

    )
}

export default Payment