import React from 'react'
import MainLayout from '../layouts/Main'
import { title, subtitle } from "../components/primitives";
import Search from '../components/search';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip'
import { useAuth } from '../context/AuthContext';

function Platform() {
   
    return (
        <MainLayout>
           {loading ? <>Loading</> : 
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center">
                    <span className={title()}>Make&nbsp;</span>
                    <span className={title({class:"text-[#dd4819] font-bold"})}>Beautiful&nbsp;</span>
                    <br />
                    <span className={title()}>
                        websites regardless
                    </span>
                    <div className={subtitle({ class: "mt-4" })}>
                        PlenoTube is a public utility that helps you find what people have to offer on the internet
                    </div>
                </div>


                <div className="mt-5 w-[90%] lg:w-[75%]">
                    <Search />
                </div>
                <div className="mt-5">
                    <div>
                        <Button color="default" radius="full" variant="flat" className='bg-[#303032] text-white'>
                            Search PlenoTube
                        </Button>
                    </div>
                </div>
                <div className='mt-5 w-[40%] gap-2 flex justify-center items-center'>
                    <Chip variant='flat' radius='sm' border='1' className='px-3 py-2 bg-[#ff57221f] cursor-pointer flex items-center'>
                        Instagram
                    </Chip>
                    <Chip variant='flat' radius='sm' border='1' className='px-3 py-2 bg-[#ff57221f] cursor-pointer flex items-center'>Youtube</Chip>
                    <Chip variant='flat' radius='sm' border='1' className='px-3 py-2 bg-[#ff57221f] cursor-pointer flex items-center'>Facebook</Chip>
                    <Chip variant='flat' radius='sm' border='1' className='px-3 py-2 bg-[#ff57221f] cursor-pointer flex items-center'>TikTok</Chip>
                </div>
            </section>
           }
        </MainLayout >
    )
}

export default Platform