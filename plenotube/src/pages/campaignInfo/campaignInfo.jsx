import React, { useState } from 'react'
import MainLayout from '../../layouts/Main'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { FaChevronLeft } from "react-icons/fa";
import { Image } from '@heroui/image';
import Rating from '../../components/Rating';
import { Card } from '@heroui/card';
import { HiMiniUsers } from "react-icons/hi2";
import ReviewCount from '../../components/ReviewCount';
import UserProfile from '../../components/User';
import Reviews from '../../components/Reviews';
import { Pagination } from '@heroui/pagination';
import SectionTopBack from '../../components/SectionTopBack';

function CampaignInfo() {
    return (
        <MainLayout>
            <div className='w-full max-h-full overflow-auto custom-scroll'>
                 <SectionTopBack />
                <div className='p-4 grid grid-cols-12 gap-5 justify-between items-center w-full'>
                    <div className='col-span-4'>
                        <Image
                            alt="HeroUI hero Image"
                            src="https://heroui.com/images/hero-card-complete.jpeg"
                            width={400}
                        />
                    </div>
                    <div className='col-span-5'>
                        <UserProfile />
                        <h2 className='text-3xl font-semibold'>
                            Get Paid to Post Gambling Content
                        </h2>
                        <div className='flex gap-2 items-center mt-2 text-md font-medium'>
                            <Rating />
                            4.3
                            <span className='text-primary'>(140)</span>
                        </div>
                        <div className='mt-3'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam consectetur neque vel? Nisi sed officiis ipsum praesentium est similique dolorum.
                        </div>
                    </div>
                    <div className='col-span-3'>
                        <Card
                            variant='flat'
                            className='p-4 flex flex-col gap-5 items-center justify-center border border-zinc-300 dark:border-zinc-700  bg-dark1'
                        >
                            <div className='text-zinc-400 text-sm font-medium'>
                                <span className='text-white'>Join</span> Lorem ipsum dolor sit.
                            </div>
                            <Button variant='solid' color='primary' className='w-full'>Join</Button>
                            <div className=' flex gap-2 items-center'>
                                <span><HiMiniUsers /></span>
                                <span className='text-sm font-medium'>12k Joined</span>
                            </div>
                        </Card>
                    </div>
                    <Divider className='col-span-12' />
                </div>
                <div className='grid grid-cols-12 gap-5 p-4'>
                    <div className='col-span-4'>
                        <span className='font-medium'>Ratings</span>
                        <ReviewCount />
                    </div>
                    <div className='col-span-8'>
                        <span className='font-medium'>Reviews</span>
                        <div className='flex flex-col gap-3 mt-3 p-3'>
                            <div className='flex flex-col gap-3 text-sm p-2'>
                                <Reviews />
                                <Reviews />
                                <Reviews />
                                <Reviews />
                                <Reviews />
                            </div>
                            <div className='flex flex-col justify-end items-end w-full'>
                                <span className='text-xs font-zinc-700 mb-2 mr-2 font-medium'>5 out of 50</span>
                                <Pagination initialPage={1} total={10} variant='faded' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}

export default CampaignInfo