import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { FaChevronLeft } from "react-icons/fa";
import React from 'react'

function SectionTopBack() {
  return (
    <div className='w-full max-h-full overflow-auto custom-scroll'>
                <div className='p-3'>
                    <Button size='sm' radius='full' variant='bordered' className='flex gap-2'><FaChevronLeft />Back</Button>
                </div>
                <Divider />
            </div>
  )
}

export default SectionTopBack