import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input, Textarea } from "@heroui/input";
import { RiCheckDoubleFill, RiCloseLine, RiPencilFill } from 'react-icons/ri';
import SettingLayout from '../../layouts/settingLayout'
import useUser from '../../hooks/useUser'
import { useAuth } from '../../context/AuthContext'
import { TiTick } from "react-icons/ti";

function General() {
    const location = useLocation()
    const { getUserGeneral, updateUserGeneral, user, loading: userLoading } = useUser();
    const { userInfo, token, loading: authLoading } = useAuth();
    const [full_name, setFull_name] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('********');
    const [changed, setChanged] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

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
        if (!user) return; // skip until user loaded

        const norm = v => (v === undefined || v === null ? '' : String(v));

        const userFullName = norm(user.full_name);
        const userPhone = norm(user.phone);
        const userEmail = norm(user.email);
        const userBio = norm(user.bio);

        if (
            norm(full_name) !== userFullName ||
            norm(phone) !== userPhone ||
            norm(email) !== userEmail ||
            norm(bio) !== userBio
        ) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    }, [full_name, email, phone, bio, user]);

    const handleSaveChange = (e) => {
        e.preventDefault()
        if (changed) {
            updateUserGeneral({ full_name, email, phone, bio })
        }
    }

    return (
        <SettingLayout>
            {authLoading ? <>Loading....</> :
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
                                    isDisabled={!editEmail}
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

                                {editEmail ? <>
                                    <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'>
                                        <RiCloseLine />
                                    </Button>
                                </>

                                    :

                                    <Button isIconOnly variant='light' size='lg' color='primary' className='text-xl' onClick={() => setEditEmail(!editEmail)}>
                                        <RiPencilFill />
                                    </Button>
                                }
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full'>
                            <div className='flex flex-col justify-start w-[70%]'>
                                <label htmlFor="password" className='text-sm mb-2 font-semibold'>Password</label>
                                <Input
                                    isDisabled={!editPassword}
                                    id="password"
                                    labelPlacement='outside-top'
                                    placeholder="Username required"
                                    type="text"
                                    variant='fade'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password || ''}
                                    className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                />
                            </div>

                            <div className='flex gap-2 mt-7'>
                               
                                {editPassword ? <>
                                    <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'>
                                        <RiCloseLine />
                                    </Button>
                                </>:
                                 <Button isIconOnly variant='light' size='lg' color='primary' className='text-xl' onClick={() => setEditPassword(!editPassword)}>
                                    <RiPencilFill />
                                </Button>
                                }

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
                                        isDisabled={!editPhone}
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
                               

                                {editPhone ? <>
                                    <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'>
                                        <RiCloseLine />
                                    </Button>
                                </>:
                                 <Button isIconOnly variant='light' size='lg' color='primary' className='text-xl' onClick={() => setEditPhone(!editPhone)}>
                                    <RiPencilFill />
                                </Button>
                                }
                            </div>
                        </div>

                    </div>
                    <Button
                        isDisabled={!changed}
                        size='lg'
                        variant='solid'
                        color='primary'
                        className='w-full mt-4'
                        onClick={(e) => handleSaveChange(e)}
                        isLoading={userLoading}
                    >
                        Save
                    </Button>
                </>
            }
        </SettingLayout>
    )
}

export default General