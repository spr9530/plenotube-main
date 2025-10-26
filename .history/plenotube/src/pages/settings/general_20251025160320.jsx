import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input, Textarea } from "@heroui/input";
import { RiPencilFill } from 'react-icons/ri';
import SettingLayout from '../../layouts/settingLayout'
import useUser from '../../hooks/useUser'
import { useAuth } from '../../context/AuthContext'

function General() {
    const location = useLocation()
    const { getUserGeneral, user, loading: userLoading } = useUser();
    const { userInfo, token, loading: authLoading } = useAuth();
    const [full_name, setFull_name] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [changed, setChanged] = useState(false);
    useEffect(() => {
        if (!user && token) getUserGeneral(token);
        if (user) {
            setFull_name(user.full_name || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setPhone(user.phone || '');
        }
    }, [user, token, getUserGeneral]);

    useEffect(() => {
        if (!user) return;
console.log( full_name !== user?.full_name ,  bio !== user?.bio)
        if (
            full_name !== user?.full_name ||
            phone !== user?.phone ||
            email !== user?.email ||
            bio !== user?.bio
        ) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    }, [full_name, email, phone, bio, user]);



    return (
        <SettingLayout>
            {userLoading || authLoading ? <>Loading....</> :
                <>
                    <div className='flex flex-col gap-8 h-full max-h-100 overflow-auto custom-scroll'>
                        <div className='flex flex-col justify-start'>
                            <label htmlFor="name" className='text-sm mb-2 font-semibold'>Name</label>
                            <Input
                                id="name"
                                labelPlacement='outside-top'
                                placeholder="Enter Your Name"
                                type="text"
                                variant='fade'
                                onChange={(e) => setFull_name(e.target.value)}
                                value={full_name}
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
                                onChange={(e) => setBio(e.target.value)}
                                value={bio || ''}
                                className='bg-[#111] rounded-xl outline-none border border-zinc-800 py-2'
                            />
                        </div>
                        <div className='flex justify-between items-center w-full'>
                            <div className='flex flex-col justify-start w-[70%]'>
                                <label htmlFor="useremail" className='text-sm mb-2 font-semibold'>Email</label>
                                <Input
                                    isDisabled={true}
                                    id="useremail"
                                    labelPlacement='outside-top'
                                    placeholder="Username required"
                                    type="text"
                                    variant='fade'
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email || ''}
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
                                        onChange={(e) => setPhone(e.target.value)}
                                        value={phone || 'xxxxx xxxxx'}
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
                        isDisabled={!changed}
                        size='lg'
                        variant='solid'
                        color='primary'
                        className='w-full mt-4'
                    >
                        Save
                    </Button>
                </>
            }
        </SettingLayout>
    )
}

export default General