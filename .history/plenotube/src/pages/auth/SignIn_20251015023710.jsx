import React, { useState } from 'react'
import DefaultLayout from '../../layouts/default'
import { Card } from '@heroui/card'
import { Input } from '@heroui/input'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Button } from '@heroui/button'
import { SiSimplenote } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';

function SignIn() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { handleRegisterViaGoogle, user, loading: authLoading, error: authError } = useAuth();
    const handleSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const { email, name } = decoded;
        handleRegisterViaGoogle({ full_name: name, email })
    };

    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
        } = useForm()

    return (
        <DefaultLayout>
            <div className='h-full w-full flex items-center justify-center p-2'>
                <Card className='h-full flex flex-col w-full lg:max-w-[30vw] items-center justify-between p-3 py-5 gap-4'>
                    <div className='w-full flex flex-col items-center justify-center gap-2 mb-2'>
                        <SiSimplenote className='text-xl font-semibold' />
                        <h1 className='text-xl font-semibold'>PlenoTube</h1>
                        <h2 className='text-md font-medium flex gap-2 items-center'> <FaUserCircle /> Log In To Your Account</h2>
                    </div>
                    <div className='flex flex-col w-full gap-4'>
                        <div className='w-full flex flex-col '>
                            <label htmlFor='username' className='mb-1 font-medium ml-1'>Username <span className='text-danger'>*</span></label>
                            <Input
                                id='username'
                                type='text'
                                placeholder='Choose a username'
                            />
                        </div>
                        <div className='w-full flex flex-col '>
                            <label htmlFor='password' className='mb-1 font-medium ml-1'>Password <span className='text-danger'>*</span></label>
                            <Input
                                endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-solid outline-transparent cursor-pointer"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <FaRegEye className="text-2xl text-default-400 pointer-events-none cursor-pointer" />
                                        ) : (
                                            <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none cursor-pointer" />
                                        )}
                                    </button>}
                                type={isVisible ? "text" : "password"}
                                id='password'
                                placeholder='Create a password'
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2 mt-2'>
                        <div className='w-full flex flex-col '>
                            <Button
                                variant='solid'
                                color='primary'
                            >
                                Log In
                            </Button>
                        </div>
                        <div className='w-full flex flex-col '>
                            <Button
                                variant='solid'
                            >
                                Log In with Google
                            </Button>
                        </div>
                    </div>

                </Card>
            </div>
        </DefaultLayout>
    )
}

export default SignIn