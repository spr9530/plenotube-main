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


function Submission() {
        const [modal, setModal]  = useState(false)

    return (
        <MainLayout>
            <SectionTopBack />
            <div className='flex flex-col gap-5 p-4 max-h-full overflow-auto custom-scroll'>
                <div className="p-4 flex gap-5 w-full flex-col justify-center items-center">
                <div className="flex justify-center w-full">
                    <Image
                        className="object-cover"
                        alt="HeroUI hero Image"
                        src="https://heroui.com/images/hero-card-complete.jpeg"
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
                                <span>$123 paid out of $12000</span>
                                <span>10%</span>
                            </div>
                            <div className='w-full h-3 rounded-full mt-1 bg-zinc-700'>
                                <div className='w-[10%] h-full bg-warning rounded-full'></div>
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
                            <span className='font-bold'>$1.00 <span className='text-blue-200'>/ 1k</span></span>
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
                            <span className='font-semibold'>$10.00</span>
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
                            <span className='font-bold'>$200.00</span>
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
                            <span className='font-bold'>ENTERTAINMENT</span>
                        </Chip>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <span className='text-zinc-600 text-md font-bold text-sm'>PLATFORM</span>
                        <p className="font-semibold text-small flex gap-2 ">
                            <Avatar radius='sm' className="w-7 h-7 text-tiny rounded-md" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                            <Avatar radius='sm' className='w-7 h-7 text-tiny rounded-md' src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                            <Avatar radius='sm' className='w-7 h-7 text-tiny rounded-md' src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                        </p>
                    </div>
                </div>
                <div className='w-full flex gap-3 justify-between flex-col'>
                    <span className='text-zinc-600 text-md font-bold text-sm'>REEQUIREMENTS</span>
                    <div className='flex w-full flex-wrap gap-2'>
                        <Chip
                            variant='flat'
                            size='md'
                            radius='sm'
                            className='text-sm font-bold'
                        >
                            <span className='font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, beatae!</span>
                        </Chip>
                        <Chip
                            variant='flat'
                            size='md'
                            radius='sm'
                            className='text-sm font-bold'
                        >
                            <span className='font-bold'>Lorem ipsum dolor sit.</span>
                        </Chip>
                        <Chip
                            variant='flat'
                            size='md'
                            radius='sm'
                            className='text-sm font-bold'
                        >
                            <span className='font-bold'>Lorem ipsum dolor sit Lorem ipsum dolor sit amet, consectetur adipisicing elit..</span>
                        </Chip>

                        <Chip
                            variant='flat'
                            size='md'
                            radius='sm'
                            className='text-sm font-bold'
                        >
                            <span className='font-bold'>Lorem ipsum dolor sit.</span>
                        </Chip>
                        <Chip
                            variant='flat'
                            size='md'
                            radius='sm'
                            className='text-sm font-bold'
                        >
                            <span className='font-bold'>Lorem ipsum dolor sit.</span>
                        </Chip>

                    </div>
                </div>

            </div>
            
            </div>
            <div className='w-full border-t border-zinc-700 p-3 flex justify-end relative bottom-0'>
                <div className='flex justify-between p-2 px-3 w-full'>
                    <div className='flex flex-col gap-1'>
                    <span className='tesxt-md font-semibold w-full'>Dedicated Page Streamer Clips</span>
                    <div className='text-sm text-zinc-600 font-bold '>$1.00 / 1k</div>
                    </div>
                    <Button variant='solid' color='primary' className='w-full max-w-[200px] font-semibold ' onPress={()=>setModal(true)}>Submit</Button>
                </div>
            </div>
                        <SubmissionModel modal={modal} setModal={setModal} />


        </MainLayout>
    )
}

export default Submission