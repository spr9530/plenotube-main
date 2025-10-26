import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import React from 'react'
import { Input } from '@heroui/input'
import { IoMdInformationCircleOutline } from "react-icons/io"
import { Card } from '@heroui/card';
import { MdCloudUpload } from "react-icons/md";

function AccountModel({ modal, setModal }) {
    return (
        <>
            <Modal isOpen={modal} size='2xl' scrollBehavior='inside' backdrop='blur' placement="top-center" className='border custom-scroll border-zinc-700'>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 justify-center w-full border-b border-zinc-700">
                        Create Submission
                    </ModalHeader>
                    <ModalBody className='mt-2'>
                        <div
                            className="col-span-11 bg-warning-50 rounded-xl p-3 text-warning text-sm font-medium flex gap-2 items-start overflow-clip"
                        >
                            <span><IoMdInformationCircleOutline className="text-lg mt-1" /></span>
                            Only views after you submit count towards payout. Submit as soon as you post to get paid for all of your views.
                        </div>
                        <div className='flex flex-col font-semibold text-lg'>
                            <div className='flex flex-col'>
                                <div>Submit your social media post</div>
                                <div className='text-sm text-zinc-600'>Share your post's link and the original image or video below. Once approved, you'll start earning rewards based on the views your content generates.</div>
                            </div>
                            <div className='flex flex-col mt-3 gap-2'>
                                <label htmlFor="provideLink " className='text-sm text-zinc-600'>Provide Link <span className='text-danger'>*</span></label>
                                <Input
                                    id='provideLink'
                                    type='text'
                                    placeholder='https://instagram.com/reel/n&hen-4'
                                />
                            </div>
                          
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={()=>setModal(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AccountModel