import React, { useState } from 'react'
import MainLayout from '../../layouts/Main'
import { Image } from '@heroui/image'
import { Divider } from '@heroui/divider'
import { Button } from '@heroui/button'
import SectionTopBack from '../../components/SectionTopBack'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import SubmissionModel from './submissionModel'
import { useCampaignContext } from '../../context/CampaignContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'


function Submission() {
    const [modal, setModal] = useState(false)
    const [campaign, setCampaign] = useState(null);
    const { getCampaignInfo,particularCampaign, loading } = useCampaignContext();
    const { userInfo } = useAuth()
    const location = useLocation();
    const { id, back } = location.state || {};

    useEffect(() => {
        if (userInfo && !particularCampaign) {
            const fetchData = async () => {
                await getCampaignInfo(id);
            };
            fetchData();
        }
    }, [userInfo, id]);

    return (
        <MainLayout>
            {loading ? <>loading..........</> :
                <>
                    <SectionTopBack redirect={back} />
                    <div className='flex flex-col gap-5 p-4 max-h-full overflow-auto custom-scroll'>
                        <div className="p-4 flex gap-5 w-full flex-col justify-center items-center">
                            <div className="flex justify-center w-full">
                                <Image
                                    className="object-cover"
                                    alt="HeroUI hero Image"
                                    src={particularCampaign?.imageUrl}
                                    width={400}
                                />
                            </div>

                            <Button
                                size="lg"
                                variant="flat"
                                color="warning"
                                className="col-span-11 font-semibold flex items-center"
                            >
                                <IoMdInformationCircleOutline className="text-xl" />
                                Only views after you submit count towards payout. Submit as soon as you post to get paid for all of your views.
                            </Button>
                            <Divider />
                            <div className='flex flex-col gap-3 w-full'>
                                <div className='text-zinc-600 text-sm font-bold'>
                                    <div>
                                        PAID OUT
                                    </div>
                                    <div>
                                        <div className='text-white flex w-full justify-between text-sm'>
                                            <span>₹{particularCampaign?.paid || 0} paid out of ₹{particularCampaign?.budget}</span>
                                            <span>{particularCampaign?.paid / particularCampaign?.budget || 0}%</span>
                                        </div>
                                        <div className='w-full h-3 rounded-full mt-1 bg-zinc-700'>
                                            <div className={`h-full bg-warning rounded-full`} style={{
                                                width: `${particularCampaign?.paid ? (particularCampaign?.paid / particularCampaign?.budget) * 100 : 2}%`
                                            }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex gap-3 justify-between'>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>REWARDS</span>
                                    <Chip
                                        variant='solid'
                                        color='primary'
                                        size='md'
                                        radius='sm'
                                        className='text-sm font-bold'
                                    >
                                        <span className='font-bold'>₹{particularCampaign?.reward} <span className='text-blue-200'>/ 1k</span></span>
                                    </Chip>

                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>TYPE</span>
                                    <Chip
                                        variant='flat'
                                        size='md'
                                        radius='sm'
                                        className='text-sm font-bold'
                                    >
                                        <span className='font-bold'>CLIPPING</span>
                                    </Chip>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>MINIMUM PAYOUT</span>
                                    <Chip
                                        variant='flat'
                                        size='md'
                                        radius='sm'
                                        className='text-sm font-bold'
                                    >
                                        <span className='font-bold'> ₹{particularCampaign?.minPayout}.00</span>
                                    </Chip>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>MAXIMUM PAYOUT</span>
                                    <Chip
                                        variant='flat'
                                        size='md'
                                        radius='sm'
                                        className='text-sm font-bold'
                                    >
                                        <span className='font-bold'>₹{particularCampaign?.maxPayout}.00</span>
                                    </Chip>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>CATEGORY</span>
                                    <Chip
                                        variant='flat'
                                        size='md'
                                        radius='sm'
                                        className='text-sm font-bold'
                                    >
                                        <span className='font-bold capitalize'>{particularCampaign?.category}</span>
                                    </Chip>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-zinc-600 text-md font-bold text-sm'>PLATFORM</span>
                                    <p className="font-semibold text-small flex gap-2 ">
                                        {
                                            particularCampaign?.platforms.includes("Facebook") &&
                                            <Avatar radius='sm' className="w-6 h-6 text-tiny rounded-md" src="/icons/facebook.png" />}
                                        {
                                            particularCampaign?.platforms.includes("Instagram") &&
                                            <Avatar radius='sm' className='w-6 h-6 text-tiny rounded-md' src="/icons/instagram.png" />
                                        }
                                        {
                                            particularCampaign?.platforms.includes("Youtube") &&
                                            <Avatar radius='sm' className='w-6 h-6 text-tiny rounded-md' src="/icons/youtube.png" />
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className='w-full flex gap-3 justify-between flex-col'>
                                <span className='text-zinc-600 text-md font-bold text-sm'>REEQUIREMENTS</span>
                                <div className='flex w-full flex-wrap gap-2'>
                                    {particularCampaign?.requirements?.map((req, index) => (
                                        <Chip
                                            key={index}
                                            variant='flat'
                                            size='md'
                                            radius='sm'
                                            className='text-sm font-bold'
                                        >
                                            <span className='font-bold'>{req}</span>
                                        </Chip>
                                    ))}

                                </div>
                            </div>

                        </div>

                    </div>
                    <div className='w-full border-t border-zinc-700 p-3 flex justify-end relative bottom-0'>
                        <div className='flex justify-between p-2 px-3 w-full'>
                            <div className='flex flex-col gap-1'>
                                <span className='tesxt-md font-semibold w-full'>Dedicated Page Streamer Clips</span>
                                <div className='text-sm text-zinc-600 font-bold '>₹1.00 / 1k</div>
                            </div>
                            <Button variant='solid' color='primary' className='w-full max-w-[200px] font-semibold ' onPress={() => setModal(true)}>Submit</Button>
                        </div>
                    </div>
                    <SubmissionModel modal={modal} setModal={setModal} />
                </>
            }


        </MainLayout>
    )
}

export default Submission