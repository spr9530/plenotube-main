import React, { useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar, AvatarGroup } from "@heroui/avatar"
import { Chip } from '@heroui/chip';
function InfoCard({
    title = "Campaign Title",
    platforms = ["Instagram", "Youtubr"],
    reward = 500,
    budget = 20000,
    paid = 2000,
    createdBy = 'Jhon deo',
    description,
    views = 100000
}) {
    return (
        <Card className="max-w-[340px] border-1 border-zinc-700 bg-zinc-900">
            <CardHeader className="justify-between">
                <div className="flex gap-5">
                    <Avatar
                        radius="full"
                        size="sm"
                        src="https://heroui.com/avatars/avatar-1.png"
                    />
                    <div className="flex flex-col items-start justify-center">
                        <h4 className="text-md font-semibold leading-none">{title}</h4>
                    </div>
                </div>
                <Chip size='sm' variat='solid' radius='sm' color='primary' >
                    <div className='px-3 py-1 flex gap-1 text-[12px] font-semibold'>

                        <span>₹{reward}</span><span>/</span><span className='text-blue-300'>1k</span>
                    </div>
                </Chip>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small font-medium overflow-hidden">
                <p className="line-clamp-1">{description}</p>
                <span className="pt-2 flex flex-col gap-1 text-[14px] font-semibold">
                    ₹{paid} Of ₹{budget} paid out
                    <div className={`h-2 bg-[#333332] rounded-full w-full`} role="img">
                        <div className={`h-full bg-[orange] rounded-full `}
                        style={{ width: `${(paid / budget) * 100}%` }}
                        role="img">
                        </div>
                    </div>

                </span>
            </CardBody>
            <CardFooter className="flex justify-between gap-3">
                <div className="flex flex-col gap-1 justify-center  ">
                    <p className=" text-small font-semibold text-zinc-500">Type</p>
                    <p className="font-semibold text-small">Clipping</p>
                </div>
                <div className="flex flex-col gap-1 justify-center ">
                    <p className="text-small text-zinc-500 font-semibold">Platform</p>
                    <p className="font-semibold text-small flex justify-center gap-1 ">
                        {
                            platforms.includes("Facebook") &&
                            <Avatar radius='sm' className="w-5 h-5 text-tiny rounded-md" src="/icons/facebook.png" />}
                        {
                            platforms.includes("Instagram") &&
                            <Avatar radius='sm' className='w-5 h-5 text-tiny rounded-md' src="/icons/instagram.png" />
                        }
                        {
                            platforms.includes("Youtube") &&
                            <Avatar radius='sm' className='w-5 h-5 text-tiny rounded-md' src="/icons/youtube.png" />
                        }
                    </p>
                </div>
                <div className="flex flex-col gap-1 justify-center ">
                    <p className="text-small text-zinc-500 font-semibold">Views</p>
                    <p className="font-semibold text-small">{views}</p>
                </div>
            </CardFooter>
        </Card>
    )
}

export default InfoCard