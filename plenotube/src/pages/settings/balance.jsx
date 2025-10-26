import React from 'react'
import SettingLayout from '../../layouts/settingLayout'
import { Divider } from '@heroui/divider'
import { Button } from '@heroui/button'
import TableComponent from '../../components/Table'

function Balance() {
    return (
        <SettingLayout>
            <div className=' max-h-full overflow-auto custom-scroll'>
                <div className='flex flex-col gap-2 justify-between'>
                    <div className='font-semibold'>Available Balance</div>
                    <div className='text-3xl font-semibold'>
                        $0.00
                    </div>
                    <Divider className='mt-3' />
                </div>
                <div className='w-full my-6'>
                    <Button variant='flat' color='primary' className='w-full'>Verify And Payout</Button>
                </div>
                <div>
                    <TableComponent />
                </div>
            </div>
        </SettingLayout>
    )
}

export default Balance