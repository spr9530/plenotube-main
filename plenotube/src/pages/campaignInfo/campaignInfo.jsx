import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCampaignContext } from "../../context/CampaignContext";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import UserProfile from '../../components/User';
import {Image} from '@heroui/image'
import { Avatar } from '@heroui/avatar';
import Rating from '../../components/Rating';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import MainLayout from '../../layouts/Main';
import StarSelect from '../../components/StarSelect';
import { Input } from '@heroui/input';
import Reviews from '../../components/Reviews';
import SectionTopBack from '../../components/SectionTopBack'
import ReviewCount from '../../components/ReviewCount';
import {Pagination} from '@heroui/pagination';
import {Card} from '@heroui/card'
import {HiMiniUsers} from 'react-icons/hi2'

function CampaignInfo() {
    const { getCampaignInfo, particularCampaign, loading } = useCampaignContext();
    const { userInfo } = useAuth();
    const location = useLocation();
    const { id, back } = location.state || {};

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    // ---------------- FETCH CAMPAIGN ----------------
    useEffect(() => {
        if (userInfo && !particularCampaign) {
            getCampaignInfo(id);
        }
    }, [userInfo, id]);

    // ---------------- RATING HANDLERS ----------------
    const handleMouseEnter = useCallback((value) => {
        setHover(value);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHover(0);
    }, []);

    const handleClick = useCallback((value) => {
        setRating(value);
    }, []);

    // ---------------- SUBMIT REVIEW ----------------
    const handleSubmit = useCallback(() => {
        if (rating < 1 || rating > 5) return;

        console.log("Review Submitted:", {
            rating,
            comment: comment.trim()
        });

        setRating(0);
        setComment("");
    }, [rating, comment]);

    // ---------------- STATIC UI MEMOIZED ----------------
    const HeaderSection = useMemo(() => {
        if (!particularCampaign) return null;

        return (
            <div className='p-4 grid grid-cols-12 gap-5'>
                <div className='col-span-4'>
                    <Image src={particularCampaign?.imageUrl} width={400} />
                </div>

                <div className='col-span-5'>
                    <UserProfile user={particularCampaign?.createdBy} />
                    <h2 className='text-3xl font-semibold capitalize'>{particularCampaign?.title}</h2>

                    <div className='flex gap-2 items-center mt-2 text-md font-medium'>
                        <Rating />
                        4.3 <span className='text-primary'>(140)</span>
                    </div>

                    <div className='mt-3'>{particularCampaign?.description}</div>

                    <div className='flex gap-4 mt-4'>
                        {particularCampaign?.platforms?.map((p) => (
                            <Avatar key={p} radius='sm' className="w-8 h-8 rounded-md" src={`/icons/${p.toLowerCase()}.png`} />
                        ))}
                    </div>
                </div>

                <div className='col-span-3 h-full'>
                    <Card className='p-4 flex flex-col gap-5 items-center bg-dark1'>
                        <div className='text-zinc-400 text-sm'>
                            <span className='text-white'>Join</span> Lorem ipsum dolor sit.
                        </div>

                        <Link to="submission" className='w-full' state={{ id: particularCampaign?._id, back }}>
                            <Button color="primary" className="w-full">Join</Button>
                        </Link>

                        <div className='flex gap-2 items-center'>
                            <HiMiniUsers />
                            <span className='text-sm font-medium'>12k Joined</span>
                        </div>
                    </Card>
                </div>

                <Divider className='col-span-12' />
            </div>
        );
    }, [particularCampaign, back]);

    // fake reviews for now
    const reviewList = useMemo(() => [
        { rating: 4, comment: "Lorem ipsum dolor sit amet..." },
        { rating: 4, comment: "Lorem ipsum dolor sit amet..." }
    ], []);

    // ---------------- MAIN RENDER ----------------
    if (loading) return <MainLayout>loading...</MainLayout>;

    return (
        <MainLayout>
            <div className="w-full max-h-full overflow-auto custom-scroll">
                <SectionTopBack redirect={back} />

                {HeaderSection}

                <div className='grid grid-cols-12 p-4'>
                    <div className='col-span-4'>
                        <span className='font-medium'>Ratings</span>
                        <ReviewCount />
                    </div>

                    <div className='col-span-8'>
                        <span className='font-medium'>Reviews</span>

                        <MemoReviewsSection items={reviewList} />

                        {/* ---------------- Add Review ---------------- */}
                        <div className="flex flex-col gap-3 mt-3 p-3">

                            <StarSelect
                                rating={rating}
                                hover={hover}
                                onEnter={handleMouseEnter}
                                onLeave={handleMouseLeave}
                                onClick={handleClick}
                            />

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Write review"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="bg-[#111] w-full rounded-xl border border-zinc-800"
                                />
                                <Button color="primary" onClick={handleSubmit}>Submit</Button>
                            </div>

                            <div className='flex justify-end items-end w-full'>
                                <span className='text-xs mb-2 mr-2'>5 out of 50</span>
                                <Pagination initialPage={1} total={10} variant='faded' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}


const MemoReviewsSection = React.memo(function MemoReviewsSection({ items }) {
    return (
        <div className="flex flex-col gap-3 text-sm p-2">
            {items.map((rev, i) => (
                <Reviews key={i} comment={rev.comment} rating={rev.rating} />
            ))}
        </div>
    );
});


export default CampaignInfo;