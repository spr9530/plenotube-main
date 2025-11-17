import React from 'react'
import MainLayout from '../layouts/Main'
import { Button } from "@heroui/button";
import { FaBookOpen } from 'react-icons/fa6';
import { Divider } from "@heroui/divider";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import InfoCard from '../components/Card';
import CardSkeleton from '../components/cardSkeleton';
import { useCampaignContext } from '../context/CampaignContext';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useState } from 'react';

function Discover() {

    const { discover, discoverEnd, discoverLoading, getDiscover, setDiscover, setDiscoverEnd } = useCampaignContext()
    const { userInfo, loading } = useAuth();
    const [page, setPage] = useState(1);
    const [platform, setPlatform] = useState('');
    const [category, setCategory] = useState('');
    const firstCallDone = useRef(false);
    const firstFilterRun = useRef(true);
    
    useEffect(() => {
        if (!userInfo || firstCallDone.current) return;
        getDiscover(1);      // No filters for first load
        firstCallDone.current = true;
    }, [userInfo]);


    useEffect(() => {
        if (firstFilterRun.current) {
            firstFilterRun.current = false;
            return;
        }
        setDiscover([]);
        setDiscoverEnd(false);
        setPage(1);

        getDiscover(1, platform, category);

    }, [platform, category]);

    useEffect(() => {
        if (page === 1) return;
        getDiscover(page, platform, category);
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (discoverLoading || discoverEnd || !discover.hasMore) return;

            const scrolledToBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;

            if (scrolledToBottom) setPage(prev => prev + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [discoverLoading, discoverEnd, discover.hasMore]);

    const handlePlatform = e => setPlatform(e.target.value);
    const handleCategory = e => setCategory(e.target.value);

    const handleClearFilter = () => {
        setPlatform('');
        setCategory('');
        setDiscover([]);
        setDiscoverEnd(false);
        setPage(1);

        getDiscover(1, '', '');
    };


    return (
        <MainLayout className='p-4 lg:p-16 lg:pt-8'>
            <div className='flex w-full flex-col '>
                <div className='flex w-full justify-between'>
                    <h1 className='text-2xl font-bold mb-1'>Discover Page</h1>
                    <Button color="primary" variant='light' size='md' className='flex gap-2 px-5 items-center justify-center border-1'>&nbsp; <FaBookOpen /> Learn &nbsp;</Button>
                </div>
                <h2 className='text-zinc-800 dark:text-zinc-300'>Post content on social media and get paid for the views you generate. If you want to launch a campaign click here.</h2>
                <Divider className="mt-4 h-[1px]" />
            </div>
            <div className='hidden lg:flex'>
                <div className='w-full grid grid-cols-10'>
                    <div className='col-span-3 text-zinc-800 dark:text-zinc-300'>
                        <div className='flex items-center text-[12px] font-semibold h-full'>851 live Content Rewards</div>
                    </div>
                    <div className='col-span-7 w-full text-zinc-800 dark:text-zinc-300'>
                        <div className='flex w-full gap-2 items-center mt-3'>
                            {(platform || category) && <div className='flex gap-2 col-span-2'>
                                <Button size='sm' variant='light' color='danger' className='font-semibold' onPress={(e) => handleClearFilter(e)}>Clear X</Button>
                            </div>}
                            <div className='flex w-full gap-2 col-span'>
                                <Select
                                    className="  max-w-md col-span-4"
                                    label="Platform"
                                    labelPlacement='outside-left'
                                    placeholder="Platform"
                                    onChange={(e) => handlePlatform(e)}
                                >
                                    <SelectItem className='outline-none w-full' key='Instagram'>Instagram</SelectItem>
                                    <SelectItem className='outline-none w-full' key='Youtube'>Youtube</SelectItem>
                                    <SelectItem className='outline-none w-full' key='Facebook'>Facebook</SelectItem>
                                </Select>
                            </div>
                            <div className='flex w-full gap-2 col-span'>
                                <Select
                                    className=" max-w-md col-span-4"
                                    label="Category"
                                    labelPlacement='outside-left'
                                    placeholder="Category"
                                    onChange={(e) => handleCategory(e)}
                                >
                                    <SelectItem className='outline-none w-full' key='personal-branding'>Personal Branding</SelectItem>
                                    <SelectItem className='outline-none w-full' key='product'>Product</SelectItem>
                                    <SelectItem className='outline-none w-full' key='music'>Music</SelectItem>
                                    <SelectItem className='outline-none w-full' key='tech'>Technology</SelectItem>


                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='mt-5 grid md:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-3 w-full'>
                {discover.map((campaign, index) => (
                    <div key={index} className="col-span-4">
                        <Link to={`campaign/${campaign.title}`} state={{ id: campaign._id, back: '/platform/discover' }}>
                            <InfoCard
                                title={campaign.title}
                                platforms={campaign.platforms}
                                reward={campaign.reward}
                                budget={campaign.budget}
                                paid={2000}
                                createdBy={campaign.createdBy?.name || 'Unknown'}
                                views={100000}
                                category={campaign?.category}
                                description={campaign.description}
                            />
                        </Link>
                    </div>
                ))}

                {discoverLoading && (
                    <>
                        <div className="col-span-4"><CardSkeleton /></div>
                        <div className="col-span-4"><CardSkeleton /></div>
                        <div className="col-span-4"><CardSkeleton /></div>
                    </>
                )}
                {discoverEnd && !discoverLoading && (
                    <div className="col-span-12 text-center text-gray-500 py-4">
                        🎉 You’ve reached the end!
                    </div>
                )}

            </div>
        </MainLayout>
    )
}

export default Discover