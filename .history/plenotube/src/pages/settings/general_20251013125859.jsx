import React from 'react'
import MainLayout from '../../layouts/Main'
import { Avatar } from '@heroui/avatar'
import { Divider } from '@heroui/divider'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { IoSettingsOutline } from 'react-icons/io5';
import { IoSettingsSharp } from 'react-icons/io5';
import { PiPlugsConnectedLight } from 'react-icons/pi';
import { PiPlugsConnectedFill } from 'react-icons/pi';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import { RiMoneyDollarBoxLine } from 'react-icons/ri';
import { PiPiggyBankFill } from 'react-icons/pi';
import { PiPiggyBank } from 'react-icons/pi';
import { FaRegRectangleList } from 'react-icons/fa6';
import { FaRectangleList } from 'react-icons/fa6';
import { CgDanger } from 'react-icons/cg';
import { Input, Textarea } from "@heroui/input";
import { RiCheckDoubleFill } from 'react-icons/ri';
import { RiCloseLine } from 'react-icons/ri';
import { RiPencilFill } from 'react-icons/ri';
import SettingLayout from '../../layouts/settingLayout'
// import ''

const navItems = [
    { name: 'Genral', link: '/platform/profile/general', active: <IoSettingsSharp className='text-2xl' />, icon: <IoSettingsOutline className='text-2xl' /> },
    { name: 'Connected Accounts', link: '/platform/profile/connected-accounts', active: <PiPlugsConnectedFill className='text-2xl' />, icon: <PiPlugsConnectedLight className='text-2xl' /> },
    { name: 'Payment Methods', link: '/platform/profile/payment-methods', active: <RiMoneyDollarBoxFill className='text-2xl' />, icon: <RiMoneyDollarBoxLine className='text-2xl' /> },
    { name: 'Balance', link: '/platform/profile/balance', active: <PiPiggyBankFill className='text-2xl' />, icon: <PiPiggyBank className='text-2xl' /> },
    { name: 'Orders', link: '/platform/profile/orders', active: <FaRectangleList className='text-2xl' />, icon: <FaRegRectangleList className='text-2xl' /> },
    { name: 'Dager Zone', link: '/platform/profile/danger-zone', active: <CgDanger className='text-2xl' />, icon: <CgDanger className='text-2xl' /> },
]

function General() {
    const location = useLocation()

    return (
        <SettingLayout>

            <div className='flex flex-col gap-8 h-full max-h-100 overflow-auto custom-scroll'>
                            <div className='flex flex-col justify-start'>
                                <label htmlFor="name" className='text-sm mb-2 font-semibold'>Name</label>
                                <Input
                                    id="name"
                                    labelPlacement='outside-top'
                                    placeholder="Enter Your Name"
                                    type="text"
                                    variant='fade'
                                    className='bg-[#111] rounded-xl outline-none border border-zinc-800'

                                />
                            </div>
                            <div className='flex flex-col justify-start'>
                                <label htmlFor="email" className='text-sm mb-2 font-semibold'>Bio</label>
                                <Textarea
                                    id="bio"
                                    labelPlacement='outside-top'
                                    placeholder="No Bio Yet"
                                    type="text"
                                    variant='fade'
                                    className='bg-[#111] rounded-xl outline-none border border-zinc-800 py-2'
                                />
                            </div>
                            <div className='flex flex-col justify-start'>
                                <label htmlFor="username" className='text-sm mb-2 font-semibold'>Username</label>
                                <Input
                                    id="username"
                                    labelPlacement='outside-top'
                                    placeholder="Username required"
                                    type="text"
                                    variant='fade'
                                    className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                />
                            </div>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col justify-start w-[70%]'>
                                    <label htmlFor="username" className='text-sm mb-2 font-semibold'>Username</label>
                                    <Input
                                        isDisabled={true}
                                        id="username"
                                        labelPlacement='outside-top'
                                        placeholder="Username required"
                                        type="text"
                                        variant='fade'
                                        value={'sparshmanhas111@gmail.com'}
                                        className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                    />
                                </div>

                                <div className='flex gap-2 mt-7'>
                                    <Button isIconOnly variant='light' size='lg' color='primary' className='text-xl'>
                                        <RiPencilFill />
                                    </Button>
                                    {/* <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'>
                                        <RiCloseLine />
                                    </Button> */}
                                </div>
                            </div>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col justify-start w-[70%]'>
                                    <label htmlFor="phone" className='text-sm mb-2 font-semibold'>Phone</label>
                                    <div className='flex gap-3'>
                                        <Button isIconOnly variant='fade' size='lg' className='bg-[#111] rounded-xl outline-none border border-zinc-800 p-2'>
                                            <img src='/icons/indian_flag.svg' alt='india' />
                                        </Button>
                                        <Input
                                            isDisabled={true}
                                            id="phone"
                                            labelPlacement='outside-top'
                                            placeholder="Phone"
                                            type="text"
                                            variant='fade'
                                            value={'xxxxx xxxxx'}
                                            className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-2 mt-7'>
                                    <Button isIconOnly variant='light' size='lg' color='primary' className='text-xl'>
                                        <RiPencilFill />
                                    </Button>
                                    {/* <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'>
                                        <RiCloseLine />
                                    </Button> */}
                                </div>
                            </div>

                        </div>
                        <Button
                            isDisabled
                            size='lg'
                            variant='solid'
                            color='primary'
                            className='w-full mt-4'
                        >
                            Save
                        </Button>
        </SettingLayout>
    )
}

export default General