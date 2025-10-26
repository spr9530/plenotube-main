import React from 'react'
import MainLayout from '../../layouts/Main'
import SectionTopBack from '../../components/SectionTopBack'
import TableComponent from '../../components/Table'

function MySubmission() {
  return (
    <MainLayout>
      <div className='w-full max-h-full overflow-auto custom-scroll'>
        <SectionTopBack />
        <div className='p-4 flex flex-col gap-5'>
          <div className=' max-h-full overflow-auto custom-scroll'>
          <div className='flex flex-col gap-2 justify-between'>
            <div className='font-semibold'>My Submission</div>
          </div>
        </div>
        <div><TableComponent /></div>
        </div>
      </div>
    </MainLayout>
  )
}

export default MySubmission