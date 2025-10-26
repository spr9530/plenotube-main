import React from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { IoMdInformationCircleOutline } from "react-icons/io";
import SettingLayout from '../../layouts/settingLayout'
import AccountModel from './accountModel.jsx/AccountModel';
import { useState } from 'react';
import { useUserContext } from '../../context/UserContext';


function Accounts() {

    const location = useLocation()
    const { genrateAccountSecurityKey } = useUserContext();
    const [modal, setModal] = useState(false);
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [securityKey, setSecurityKey] = useState('');
    const [platform, setPlatform] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateKey = async (e, platform) => {
        e.preventDefault();
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
                <div className='bg-dark1 border border-zinc-800 rounded-xl p-8 gap-2 flex justify-center align-items-center '>
                    <span><IoMdInformationCircleOutline className='text-2xl' /></span>No Account Connected
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Pending Accounts</div>
                <div className='bg-dark1 border border-zinc-800 rounded-xl p-8 gap-2 flex justify-center align-items-center '>
                    <span><IoMdInformationCircleOutline className='text-2xl' /></span>No Account Connected
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='font-semibold'>Connected Accounts</div>
                <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'Instagram'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onClick={(e) => {
                                handleGenerateKey(e, 'Instagram');
                                setPlatform('Instagram')
                                setHeading('Add this security key in your Instagram bio')
                                setDescription('After adding the security key, submit your profile link for verification');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/instagram.png" alt="fb" /></span>
                                Instagram
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'YouTube'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onClick={(e) => {
                                handleGenerateKey(e, 'Youtube');
                                setPlatform('YouTube')
                                setHeading('Add this security key in your YouTube profile')
                                setDescription('After adding the security key, submit your profile link for verification');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/youtube.png" alt="fb" /></span>
                                Youtube
                            </div>
                            <span className='text-[32px] mb-2'>+</span>
                        </Button>
                    </div>
                    <div className='col-span-4'>
                        <Button size='lg' isLoading={loading && platform == 'Facebook'} className='bg-zinc-900 border border-zinc-800 w-full flex gap-1 justify-between align-items-center p-3'
                            onClick={(e) => {
                                handleGenerateKey(e, 'Facebook');
                                setPlatform('Facebook')
                                setHeading('Add this security key in your Facebook bio')
                                setDescription('After adding the security key, submit your profile link for verification');
                            }}
                        >
                            <div className='flex gap-2 items-center w-full'>
                                <span className='max-w-[30px] overflow-hidden'><img className='object-contain' src="/icons/facebook.png" alt="fb" /></span>
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