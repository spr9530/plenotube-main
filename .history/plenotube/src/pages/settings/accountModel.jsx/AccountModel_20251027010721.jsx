import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import React from 'react'
import { Input } from '@heroui/input'
import { IoMdInformationCircleOutline } from "react-icons/io"
import { Card } from '@heroui/card';
import { MdCloudUpload } from "react-icons/md";
import { useUserContext } from '../../../context/UserContext';
import { useState } from 'react';
import { useEffect } from 'react';

const PLATFORM_REGEX = {
    Instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]{1,30}\/?$/i,

    YouTube: /^https?:\/\/(www\.)?(youtube\.com\/(c\/|channel\/|@)[A-Za-z0-9_-]+|youtube\.com\/user\/[A-Za-z0-9_-]+)\/?$/i,

    Facebook: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9\.]{5,}\/?$/i,
};

function AccountModel({ modal, setModal, heading, setHeading,
    description, setDescription, securityKey, setSecuritykey, platform, setPlatform }) {
    const { loading } = useUserContext();
    const [showSubmit, setShowSubmit] = useState(false);
    const [link, setLink] = useState('');
    const [isValid, setIsValid] = useState(true);


   const linkIsValid = (platform, link) => {
  const regex = PLATFORM_REGEX[platform];
  if (!regex) return false;
  return regex.test(link.trim());
};

useEffect(() => {
  if (link !== '') {
    const valid = linkIsValid(platform, link);
    setIsValid(valid);
    setShowSubmit(valid);
  } else {
    setIsValid(false);
    setShowSubmit(false);
  }
}, [link, platform]);



    return (
        <>
            <Modal isOpen={modal} size='2xl' scrollBehavior='inside' backdrop='blur' placement="top-center" className='border custom-scroll border-zinc-700'>
                {loading ? <>Loading..</> :
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1 justify-center w-full border-b border-zinc-700">
                            Create Submission
                        </ModalHeader>
                        <ModalBody className='mt-2'>
                            <div
                                className="col-span-11 bg-warning-50 rounded-xl p-3 text-warning text-sm font-medium flex gap-2 items-start overflow-clip"
                            >
                                <span><IoMdInformationCircleOutline className="text-lg mt-1" /></span>
                                {description}
                            </div>
                            <div className='flex flex-col font-semibold text-lg'>
                                <div className='flex flex-col items-center gap-3'>
                                    <div>{heading}</div>
                                    <div className='text-2xl font-semibold'>PLENO-{securityKey}</div>
                                    <div className='text-sm text-zinc-600'>Verification Will Take Upto 24Hrs</div>
                                </div>
                                <div className='flex flex-col mt-3 gap-2'>
                                    <label htmlFor="provideLink " className='text-sm text-zinc-600'>Provide Link <span className='text-danger'>*</span></label>
                                    <Input
                                        id='provideLink'
                                        type='text'
                                        value={link}
                                        isInvalid={!isValid}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder='https://instagram.com/account=?'
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            {showSubmit &&
                                <Button color="primary" variant="flat" onPress={(e) => handleSubmit(e)}>
                                    Submit
                                </Button>}
                            <Button color="danger" variant="flat" onPress={() => {
                                setLink('')
                                setModal(false)
                                setPlatform('')
                                setSecuritykey('')
                                setDescription('')
                                setHeading('')
                                setIsValid(true);
                            }
                                }>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                }
            </Modal>
        </>
    );
}

export default AccountModel