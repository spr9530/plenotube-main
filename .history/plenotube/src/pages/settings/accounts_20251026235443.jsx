import React from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { IoMdInformationCircleOutline } from "react-icons/io";
import SettingLayout from '../../layouts/settingLayout'


function Accounts() {

    const location = useLocation()
    const [modal, setModal] = useState(true);

    return (
        <SettingLayout>
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Connected Accounts</div>
                <div className='bg-dark1 border border-zinc-800 rounded-xl p-8 gap-2 flex justify-center align-items-center '>
                    <span><IoMdInformationCircleOutline className='text-2xl' /></span>No Account Connected
                </div>
            </div>
            {/* <div className=''>
                            Pending Verification
                        </div> */}
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Connected Accounts</div>
                <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-4'>
                        <Button size='lg' className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'>
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/instagram.png" alt="fb" /></span>
                                Instagram
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'>
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/youtube.png" alt="fb" /></span>
                                Youtube
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'>
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/facebook.png" alt="fb" /></span>
                                Facebook
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                </div>
            </div>
        </SettingLayout>
    )
}

export default Accounts