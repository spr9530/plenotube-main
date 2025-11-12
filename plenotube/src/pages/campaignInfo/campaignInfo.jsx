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
import { useCampaignContext } from '../../context/CampaignContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Avatar } from '@heroui/avatar';

function CampaignInfo() {
    const { getCampaignInfo, particularCampaign, loading } = useCampaignContext();
    const { userInfo } = useAuth()
    const location = useLocation();
    const { id, back } = location.state || {};


    useEffect(() => {
        if (userInfo) {
            const fetchData = async () => {
                await getCampaignInfo(id);
            };
            fetchData();
        }
    }, [userInfo, id]);


    return (
        <MainLayout>
            {loading ? <>
                loading....
            </> : <>
                <div className='w-full max-h-full overflow-auto custom-scroll'>
                    <SectionTopBack redirect={back} />
                    <div className='p-4 grid grid-cols-12 gap-5 justify-between items-center w-full'>
                        <div className='col-span-4'>
                            <Image
                                alt="HeroUI hero Image"
                                src={particularCampaign?.imageUrl}
                                width={400}
                            />
                        </div>
                        <div className='col-span-5'>
                            <UserProfile user={particularCampaign?.createdBy} />
                            <h2 className='text-3xl font-semibold capitalize'>
                                {particularCampaign?.title}
                            </h2>
                            <div className='flex gap-2 items-center mt-2 text-md font-medium'>
                                <Rating />
                                4.3
                                <span className='text-primary'>(140)</span>
                            </div>
                            <div className='mt-3'>
                                {particularCampaign?.description}
                            </div>
                            <div className='flex gap-4 mt-4'>
                                {
                                    particularCampaign?.platforms?.includes("Facebook") &&
                                    <Avatar radius='sm' className="w-8 h-8 text-tiny rounded-md" src="/icons/facebook.png" />}
                                {
                                    particularCampaign?.platforms?.includes("Instagram") &&
                                    <Avatar radius='sm' className='w-8 h-8 text-tiny rounded-md' src="/icons/instagram.png" />
                                }
                                {
                                    particularCampaign?.platforms?.includes("Youtube") &&
                                    <Avatar radius='sm' className='w-8 h-8 text-tiny rounded-md' src="/icons/youtube.png" />
                                }
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
                                <Link to={'submission'} state={{ id: particularCampaign?._id, back: `/platform/discover/campaign/${particularCampaign?.title}` }} className='w-full'>
                                    <Button variant='solid' color='primary' className='w-full' onPress={(e) => e.preventDefault()}>Join</Button>
                                </Link>
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
            </>}
        </MainLayout>
    )
}

export default CampaignInfo