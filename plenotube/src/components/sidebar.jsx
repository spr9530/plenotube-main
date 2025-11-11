import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ThemeSwitch } from './theme-switch'
import { FaHome, FaUser, FaRegUser } from 'react-icons/fa'
import { RiCompassDiscoverFill, RiCompassDiscoverLine } from 'react-icons/ri'
import { MdNotificationsActive, MdNotifications } from 'react-icons/md'
import { AiOutlineHome } from 'react-icons/ai'
import { PiMoneyFill, PiMoneyLight } from 'react-icons/pi'
import { BsBorderStyle } from "react-icons/bs";
import '../assets/css/style.css';


const navItems = [
    { name: 'Home', link: '/platform', active: <FaHome className='text-2xl' />, icon: <AiOutlineHome className='text-2xl' /> },
    { name: 'Discover', link: '/platform/discover', active: <RiCompassDiscoverFill className='text-2xl' />, icon: <RiCompassDiscoverLine className='text-2xl' /> },
    { name: 'My Submission', link: '/platform/my-submission', active: <PiMoneyFill className='text-2xl' />, icon: <PiMoneyLight className='text-2xl' /> },
    { name: 'My Campaign', link: '/platform/my-campaign', active: <BsBorderStyle className='text-2xl' />, icon: <BsBorderStyle className='text-2xl' /> },
    { name: 'Profile', link: '/platform/profile', active: <FaUser className='text-2xl' />, icon: <FaRegUser className='text-2xl' /> },
    { name: 'Notification', link: '/platform/notification', active: <MdNotificationsActive className='text-2xl' />, icon: <MdNotifications className='text-2xl' /> },
]

function Sidebar() {
    const location = useLocation()
    return (
        <div className="flex-col h-full hidden lg:flex p-4 pl-0 relative">
            <div className="py-8"></div>

            <div className="max-h-[50vh] overflow-y-auto custom-scroll">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.link}
                        className={
                            `flex items-center gap-2 p-3 mb-2 rounded-lg font-medium text-lg transition-all duration-300 ease-in-out
              ${location.pathname === item.link
                                ? 'bg-[#F4F4F5] dark:bg-[#18181B]'
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
            </div>

            <div className="absolute bottom-0 foreground1 p-3 w-full h-44">
                <ThemeSwitch />
            </div>
        </div>
    )
}

export default Sidebar
