import React, { useEffect } from 'react'
import MainLayout from './Main'
import { Avatar } from '@heroui/avatar'
import { Divider } from '@heroui/divider'
import { NavLink } from 'react-router-dom'
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
import useUser from '../hooks/useUser'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { name: 'Genral', link: '/platform/profile/general', active: <IoSettingsSharp className='text-2xl' />, icon: <IoSettingsOutline className='text-2xl' /> },
    { name: 'Connected Accounts', link: '/platform/profile/connected-accounts', active: <PiPlugsConnectedFill className='text-2xl' />, icon: <PiPlugsConnectedLight className='text-2xl' /> },
    { name: 'Payment Methods', link: '/platform/profile/payment-methods', active: <RiMoneyDollarBoxFill className='text-2xl' />, icon: <RiMoneyDollarBoxLine className='text-2xl' /> },
    { name: 'Balance', link: '/platform/profile/balance', active: <PiPiggyBankFill className='text-2xl' />, icon: <PiPiggyBank className='text-2xl' /> },
    { name: 'Orders', link: '/platform/profile/orders', active: <FaRectangleList className='text-2xl' />, icon: <FaRegRectangleList className='text-2xl' /> },
    { name: 'Dager Zone', link: '/platform/profile/danger-zone', active: <CgDanger className='text-2xl' />, icon: <CgDanger className='text-2xl' /> },
]

function SettingLayout({ children }) {
    const { getUserGeneral, user, loading: userLoading } = useUser();
    const { userInfo, token, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!user) {
            getUserGeneral(token);
        }
    }, [getUserGeneral, token]);


    return (
        <MainLayout>
            <div className='w-full h-full'>
                <div className='text-3xl border-b-1 border-zinc-800 w-full p-3'>
                    <p className='text-2xl font-semibold'>Account Setting</p>
                </div>
                <div className='w-full grid grid-cols-12 p-2 h-full max-h-[84vh]'>
                    <div className='hidden lg:block col-span-3 p-2 h-full max-h-100 '>
                        <div className='border-zinc-800 gap-2 flex flex-col p-4'>
                            <div className=''>
                                <Avatar
                                    className="w-20 h-20 text-large"
                                    src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                                />
                            </div>
                            <div className='flex flex-col font-semibold'>
                                <h2>{user?.full_name || '......'}</h2>
                                <p className='text-zinc-600'>{user?.username || '......'}</p>
                            </div>
                        </div>
                        <Divider size='sm' className='bg-zinc-800 mb-2' />
                        <div className="max-h-[50vh] overflow-y-auto custom-scroll flex flex-col align-items-center">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.link}
                                    className={
                                        `flex items-center gap-2 p-3 mb-2 rounded-lg font-medium text-md transition-all duration-300 ease-in-out
                            ${location.pathname === item.link
                                            ? 'bg-[#F4F4F5] dark:bg-zinc-800'
                                            : 'hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]'}`
                                    }
                                >
                                    {/* {item.active} */}
                                    <span className="transition-all duration-300 ease-in-out">
                                        {location.pathname === item.link ? item.active : item.icon}
                                    </span>
                                    {item.name}
                                </NavLink>
                            ))}
                            <Button variant='light' size='md' className='p-4 cursor-pointer border-2 border-zinc-800 hover:border-red-400 text-red-400 '>
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className='col-span-9 border-l-1 flex flex-col gap-7 border-zinc-800 h-full p-5 custom-scroll max-h-[84vh] custom-scroll'>
                        {children}
                    </div>
                </div>
            </div>

        </MainLayout>
    )
}

export default SettingLayout