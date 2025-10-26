import React, { useState } from 'react'
import DefaultLayout from '../../layouts/default'
import { Card } from '@heroui/card'
import { Input } from '@heroui/input'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Button } from '@heroui/button'
import { SiSimplenote } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import { InputOtp } from "@heroui/input-otp"
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


function SignUp() {
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [fillUserName, setFillUserName] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const handleSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const { email, name } = decoded;
        setEmail(email);
        setName(name);
        setFillUserName(true);
    };



    const { handleRegister, handleOtp, isOtp, user, loading: authLoading, error: authError } = useAuth();

    const googleRegistration = (data) => handleRegisterViaGoogle({ full_name: name, email, ...data })

    const submitDetails = (data) => handleRegister(data);
    const submitOtp = (data) => handleOtp({ ...data, email: user?.email })

    return (
        <DefaultLayout>
            <div className='h-full w-full flex items-center justify-center p-2'>
                {
                    isOtp ?
                        <form onSubmit={handleSubmit(submitOtp)} className='w-full h-full min-h-[80vh]'>
                            <Card className='h-full flex flex-col w-full lg:max-w-[30vw] items-center justify-center p-3 py-5 gap-4'>
                                <div className='w-full flex flex-col items-center justify-center gap-2 mb-2'>
                                    <SiSimplenote className='text-xl font-semibold' />
                                    <h1 className='text-xl font-semibold'>PlenoTube</h1>
                                    <h2 className='text-md font-medium flex gap-2 items-center'> <FaUserCircle /> Create Your Account</h2>
                                    {authError && <span className='text-danger text-sm ml-1'>{authError}</span>}
                                </div>
                                <div className='flex flex-col w-full gap-4'>
                                    <div className='w-full flex flex-col items-center'>
                                        <label htmlFor='full-name' className='mb-1 font-medium ml-1'>OTP <span className='text-danger'>*</span></label>
                                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 items-center justify-center">
                                            <InputOtp name='otp' variant='faded' isInvalid={false} errorMessage="Invalid OTP code" length={6}
                                                {...register('otp', { pattern: /^[0-9]{6}$/, required: true })}
                                            />
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col '>
                                        <Button
                                            spinner={
                                                <svg
                                                    className="animate-spin h-5 w-5 text-current"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            }
                                            variant='solid'
                                            color='primary'
                                            type='submit'
                                            isLoading={authLoading}
                                        >
                                            Confirm OTP
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </form>
                        :
                        <Card className='h-full flex flex-col w-full lg:max-w-[30vw] items-center justify-between p-3 py-5 gap-4'>
                            <div className='w-full flex flex-col items-center justify-center gap-2 mb-2'>
                                <SiSimplenote className='text-xl font-semibold' />
                                <h1 className='text-xl font-semibold'>PlenoTube</h1>
                                <h2 className='text-md font-medium flex gap-2 items-center'> <FaUserCircle /> Create Your Account</h2>
                                {authError && <span className='text-danger text-sm ml-1'>{authError}</span>}
                            </div>
                            <form onSubmit={handleSubmit(submitDetails)} className='w-full'>
                                <div className='flex flex-col w-full gap-4'>
                                    {/* FULL NAME */}
                                    <div className='w-full flex flex-col '>
                                        <label htmlFor='full-name' className='mb-1 font-medium ml-1 w-full'>
                                            Full Name <span className='text-danger'>* <span>{errors.full_name && (
                                                <span className='text-danger text-sm ml-1'>{errors.full_name.message}</span>
                                            )}</span></span>
                                        </label>
                                        <Input
                                            id='full_name'
                                            type='text'
                                            placeholder='Enter your full name'
                                            name='full_name'
                                            isInvalid={errors.full_name ? true : false}
                                            {...register('full_name', {
                                                required: 'Full name is required',
                                                pattern: {
                                                    value: /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
                                                    message: 'Full name can only contain letters and spaces',
                                                },
                                            })}
                                        />

                                    </div>

                                    {/* EMAIL */}
                                    <div className='w-full flex flex-col '>
                                        <label htmlFor='email' className='mb-1 font-medium ml-1'>
                                            Email <span className='text-danger'>* {errors.email && (
                                                <span className='text-danger text-sm ml-1'>{errors.email.message}</span>
                                            )}</span>
                                        </label>
                                        <Input
                                            id='email'
                                            type='email'
                                            name='email'
                                            isInvalid={errors.email ? true : false}

                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Enter a valid email address',
                                                },
                                            })}
                                            placeholder='sample@gmail.com'
                                        />

                                    </div>

                                    {/* PASSWORD */}
                                    <div className='w-full flex flex-col '>
                                        <label htmlFor='password' className='mb-1 font-medium ml-1'>
                                            Password <span className='text-danger'>*</span>
                                        </label>
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
                                                </button>
                                            }
                                            type={isVisible ? 'text' : 'password'}
                                            id='password'
                                            name='password'
                                            isInvalid={errors.password ? true : false}
                                            {...register('password', {
                                                required: 'Password is required',
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message:
                                                        'Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character',
                                                },
                                            })}
                                            placeholder='Create a password'
                                        />
                                        {errors.password && (
                                            <span className='text-danger text-sm ml-1'>{errors.password.message}</span>
                                        )}
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className='w-full flex flex-col gap-2 mt-2'>
                                    <div className='w-full flex flex-col '>
                                        <Button
                                            spinner={
                                                <svg
                                                    className="animate-spin h-5 w-5 text-current"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            }
                                            variant='solid'
                                            color='primary'
                                            type='submit'
                                            isLoading={authLoading}
                                        >
                                            Create Account
                                        </Button>
                                    </div>
                                    <GoogleLogin
                                        onSuccess={handleSuccess}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    />

                                </div>
                            </form>


                        </Card>

                }
            </div>
        </DefaultLayout>
    )
}

export default SignUp