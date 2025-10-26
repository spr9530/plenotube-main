
import { Card, CardBody, CardFooter } from '@heroui/card'
import SettingLayout from '../layouts/settingLayout'
import { Button } from '@heroui/button'
import { Image } from '@heroui/image'
import { MdDateRange } from "react-icons/md";
import { Divider } from '@heroui/divider';
import { IoLocationOutline } from "react-icons/io5";
import { Tabs, Tab } from '@heroui/tabs';
import { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';


function Profile() {
const [selected, setSelected] = useState("photos");
const { getUserGeneral, user, loading:userLoading } = useUser();
    const {userInfo, token, loading:authLoading} = useAuth();

    useEffect(()=>{
            getUserGeneral(token);
    },[])

  return (
    <SettingLayout>
      <div className='flex flex-col gap-5 justify-center items-center w-full max-h-full custum-scroll '>
        <div className='w-fit'>
          <Card isFooterBlurred className="border-none" radius="lg">
            <Image
              alt="Woman listing to music"
              className="object-cover"
              height={200}
              src="https://heroui.com/images/hero-card.jpeg"
              width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">{user?.full_name || 'Loading...'}</p>
              <Button
                className="text-tiny text-white bg-black/20"
                color="primary"
                radius="lg"
                size="sm"
                variant="flat"
              >
                Follow
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center gap-5'>
            <div className='flex gap-2 items-center font-semibold'>
              <span className='text-lg'> {user?.username || 'Loading...'} </span>
              <div>
                <Button variant='flat' color='primary'>12k followers</Button>
              </div>
            </div>
            <div className='flex gap-3 '>
              <div> $0.00 <span className='text-zinc-600 dark:text-zinc-400'>Earnings</span></div>
              <Divider orientation="vertical" />
              <div className='text-zinc-600 dark:text-zinc-400 flex gap-2 items-center'><MdDateRange />Jan, 2025</div>
              <Divider orientation="vertical" />
              <div className='text-zinc-600 dark:text-zinc-400 flex gap-2 items-center'><IoLocationOutline />Mohali</div>
            </div>
          </div>

        </div>
        <div className="flex w-full justify-center ">
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options" variant='solid' color='primary' selectedKey={selected} onSelectionChange={setSelected} className='relative'>
              <Tab key="my-campaign"  title="My Campaign">
                <Card>
                  <CardBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="orders"  title="Orders">
                <Card>
                  <CardBody>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur.
                  </CardBody>
                </Card>
              </Tab>
              {/* <Tab key="videos" title="Videos">
                <Card>
                  <CardBody>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                  </CardBody>
                </Card>
              </Tab> */}
            </Tabs>
          </div>
        </div>
      </div>
    </SettingLayout>
  )
}

export default Profile