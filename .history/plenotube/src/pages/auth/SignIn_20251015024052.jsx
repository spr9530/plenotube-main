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

    const submitDetails = (data) => handleLogin()

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
                    <form onSubmit={handleSubmit(submitDetails)}>
                        <div className='flex flex-col w-full gap-4'>
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
            </div>
        </DefaultLayout>
    )
}

export default SignIn