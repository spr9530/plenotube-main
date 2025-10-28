import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import SettingLayout from '../../layouts/settingLayout'
import AccountModel from './accountModel.jsx/AccountModel';
import { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useEffect } from 'react';


const Platform_Icon = {
    Instagram: '/icons/instagram.png',
    Youtube: '/icons/youtube.png',
    Facebook: '/icons/facebook.png'
}

const BUTTON_COLOR ={
    Pending:'warning',
    Rejected:'danger',
    Processing:'primary',
    Failed:'warning'
}

function Accounts() {

    const location = useLocation()
    const { genrateAccountSecurityKey, user } = useUserContext();
    const [modal, setModal] = useState(false);
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [securityKey, setSecurityKey] = useState('');
    const [platform, setPlatform] = useState('');
    const [loading, setLoading] = useState(false);
    const [connectedAcc, setConnectedAcc] = useState(false);
    const [pendingAcc, setPendingAcc] = useState(false);

    useEffect(() => {
        if (user?.linkedAccount?.length) {
            user.linkedAccount.forEach(acc => {
                if (acc.status === 'Verified') setConnectedAcc(true);;
                if (acc.status !== 'Verified') setPendingAcc(true);
            });

        } else {
            setConnectedAcc(false);
            setPendingAcc(false);
        }
    }, [user]);

    const handleGenerateKey = async (platform) => {
        setLoading(true);
        const key = await genrateAccountSecurityKey(platform);
        if (key) {
            setSecurityKey(key);
            setModal(true)
        }
        setLoading(false);
    }

    return (
        <SettingLayout>
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Connected Accounts</div>
                <div className='bg-dark1 border border-zinc-800 rounded-xl p-3 gap-2 flex justify-center align-items-center '>
                    {
                        connectedAcc && user?.linkedAccount.map(acc => (
                            <>
                                {acc.status == 'Verified' &&
                                    <Link to={acc?.profileLink} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-2 rounded-md'>
                                        <div className='flex gap-2 items-center w-full'>
                                            <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src={Platform_Icon[acc?.accountType]} alt="fb" /></span>
                                            @{acc?.username}
                                        </div>
                                        <span className='text-lg cursor-pointer mb-2 text-danger'><MdDelete /></span>
                                    </Link>
                                }
                            </>

                        ))
                    }
                    {!connectedAcc && <><span><IoMdInformationCircleOutline className='text-2xl' /></span>No Account Connected</>}
                </div>
            </div>
            {
                pendingAcc &&
                <div className='flex flex-col gap-2'>
                    <div className='font-semibold'>Pending Accounts</div>
                    <div className='bg-dark1 border border-zinc-800 rounded-xl p-3 gap-2 flex justify-center items-center flex-col'>
                        {
                            user?.linkedAccount.map(acc => (
                                <>
                                    {acc.status != 'Verified' &&  acc.status != 'Pending' &&
                                        <Link to={acc?.profileLink} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between items-center p-2 rounded-md'>
                                            <div className='flex gap-2 items-center w-full'>
                                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src={Platform_Icon[acc?.accountType]} alt="fb" /></span>
                                                @{acc?.username}
                                            </div>
                                            <span className='text-lg cursor-pointer mb-2 text-danger'><Button size='sm' className='min-w-[80px] font-semibold' variant="flat" color={`${BUTTON_COLOR[acc?.status]}`}>{acc?.status}</Button></span>
                                            <span className='text-lg cursor-pointer mb-2 text-danger '><MdDelete /></span>
                                        </Link>
                                    }
                                </>

                            ))
                        }
                    </div>
                </div>
            }


            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Connected Accounts</div>
                <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'Instagram'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onPress={() => {
                                handleGenerateKey('Instagram');
                                setPlatform('Instagram')
                                setHeading('Add this security key in your Instagram bio')
                                setDescription('Only after adding the security key, submit your profile link for verification. Otherwise profile will be rejected automatically');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src={Platform_Icon['Instagram']} alt="fb" /></span>
                                Instagram
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'YouTube'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onPress={() => {
                                handleGenerateKey('Youtube');
                                setPlatform('Youtube')
                                setHeading('Add this security key in your YouTube profile')
                                setDescription('After adding the security key, submit your profile link for verification');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src={Platform_Icon['Youtube']} alt="fb" /></span>
                                Youtube
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'Facebook'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onPress={() => {
                                handleGenerateKey('Facebook');
                                setPlatform('Facebook')
                                setHeading('Add this security key in your Facebook bio')
                                setDescription('After adding the security key, submit your profile link for verification');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src={Platform_Icon['Facebook']} alt="fb" /></span>
                                Facebook
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                </div>
            </div>
            <AccountModel modal={modal} setModal={setModal}
                heading={heading} setHeading={setHeading}
                description={description} setDescription={setDescription}
                securityKey={securityKey} setSecurityKey={setSecurityKey}
                platform={platform} setPlatform={setPlatform} />
        </SettingLayout>
    )
}

export default Accounts