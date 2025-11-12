import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { FaChevronLeft } from "react-icons/fa";
import React from 'react'
import { Link } from 'react-router-dom';

function SectionTopBack({redirect='platform'}) {
  console.log(redirect)
  return (
    <div className='w-full max-h-full overflow-auto custom-scroll'>
      <div className='p-3'>
        <Link to={redirect}>
          <Button 
          size='sm' 
          radius='full' 
          variant='bordered' 
          onPress={(e)=> e.preventDefault()}
          className='flex gap-2'><FaChevronLeft />Back</Button>
        </Link>
      </div>
      <Divider />
    </div>
  )
}

export default SectionTopBack