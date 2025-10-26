import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input, Textarea } from "@heroui/input";
import { InputOtp } from "@heroui/input-otp";
import { RiCheckDoubleFill, RiCloseLine, RiPencilFill } from 'react-icons/ri';
import SettingLayout from '../../layouts/settingLayout'
import useUser from '../../hooks/useUser'
import { useAuth } from '../../context/AuthContext'
import generateToast from '../../toast/GenrateToast';


function General() {
    const location = useLocation()
    const { getUserGeneral, updateUserGeneral,genrateMailChangeOtp,verifyOtp, user, updateUserPassword,  loading: userLoading } = useUser();
    const { userInfo, token, loading: authLoading } = useAuth();
    const [full_name, setFull_name] = useState(user?.full_name || '');
    const [email, setEmail] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [bio, setBio] = useState(user?.bio || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [changed, setChanged] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const validateEmail = (email) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

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
        const userBio = norm(user.bio);

        if (
            norm(full_name) !== userFullName ||
            norm(phone) !== userPhone ||
            norm(bio) !== userBio
        ) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    }, [full_name, phone, bio, user]);

    const handleSaveChange = (e) => {
        e.preventDefault()
        if (changed) {
            updateUserGeneral({ full_name, email, phone, bio })
        }
    }

    const handleGenrateOtp = (e) =>{
        e.preventDefault();
        if(email!=''){
            genrateMailChangeOtp({email});
        }else{
            generateToast({title:'Mail Error', message:'Please enter mail', type:'warning'})
        }
    } 

    const verifyEmialChange = (e) =>{
        // verifyOtp({newemail:email, email:user?.email, otp})
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
                        <div className='flex justify-between items-center w-full gap-3'>
                            <div className='flex flex-col justify-start w-[70%]'>
                                <label htmlFor="useremail" className='text-sm mb-2 font-semibold'>Email</label>
                                <Input
                                    isDisabled={!editEmail}
                                    id="useremail"
                                    labelPlacement='outside-top'
                                    placeholder="Enter new mail"
                                    type="text"
                                    variant='fade'
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    isInvalid={isInvalid}
                                    className='bg-[#111] rounded-xl outline-none border  border-zinc-800'
                                />
                            </div>

                            {editEmail && (
                                <div className='flex flex-col justify-start w-[70%]'>
                                    <label htmlFor="otp" className='text-sm mb-2 font-semibold flex flex-col'>
                                        <div>OTP <span className='text-red-500'>*</span></div>
                                        <div className='text-xs font-warning'>An otp will be sent on previous mail</div>
                                    </label>
                                    <InputOtp  length={6} size='sm' className='-mt-3' value={emailOtp} onChange={(e)=>setEmailOtp(e.target.value)} isDisabled={isInvalid} />
                                </div>
                            )}

                            <div className='flex gap-2 mt-7'>
                                {editEmail ? (
                                    <>
                                        <Button isIconOnly variant='flat' size='lg' color='primary' isLoading={userLoading} isDisabled={isInvalid} onClick={(e)=> handleGenrateOtp(e)}>
                                           <span className='font-semibold text-sm'> Send</span>
                                        </Button>
                                        <Button
                                            isIconOnly
                                            variant='flat'
                                            size='lg'
                                            color='default'
                                            onClick={() => {
                                                setEmail(user?.email);
                                                setEditEmail(false);
                                            }}
                                        >
                                            <RiCloseLine />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        isIconOnly
                                        variant='light'
                                        size='lg'
                                        color='primary'
                                        className='text-xl'
                                        onClick={() => {
                                            setEditEmail(true);
                                            setEmail(''); 
                                        }}
                                    >
                                        <RiPencilFill />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-between items-center w-full gap-3'>
                            <div className='flex flex-col justify-start w-[70%]'>
                                <label htmlFor="password" className='text-sm mb-2 font-semibold'>{editPassword ? 'Old Password' : 'Password'}</label>
                                <Input
                                    isDisabled={!editPassword}
                                    id="password"
                                    labelPlacement='outside-top'
                                    placeholder="Old Password"
                                    type="text"
                                    variant='fade'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={editPassword ? password : '*******'}
                                    className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                />
                            </div>

                            {editPassword &&
                                <div className='flex flex-col justify-start w-[70%]'>
                                    <label htmlFor="newPass" className='text-sm mb-2 font-semibold'>New Password</label>
                                    <Input
                                        id="newPass"
                                        labelPlacement='outside-top'
                                        placeholder="New Password"
                                        type="text"
                                        variant='fade'
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword || ''}
                                        className='bg-[#111] rounded-xl outline-none border border-zinc-800'
                                    />
                                </div>
                            }

                            <div className='flex gap-2 mt-7'>

                                {editPassword ? <>
                                    <Button isIconOnly variant='flat' size='lg' color='primary'>
                                        <RiCheckDoubleFill />
                                    </Button>
                                    <Button isIconOnly variant='flat' size='lg' color='default'
                                        onClick={() => {
                                            setPassword('');
                                            setNewPassword('');
                                            setEditPassword(false);
                                        }}
                                    >
                                        <RiCloseLine />
                                    </Button>
                                </> :
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
                                </> :
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