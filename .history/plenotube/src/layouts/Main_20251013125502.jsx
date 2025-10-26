import { Link } from "@heroui/link";
import Sidebar from "../components/sidebar";
import { ThemeSwitch } from '../components/theme-switch'

export default function MainLayout({
    children,
    className
}) {
    return (
        <div className="relative flex flex-col h-screen">
            <main className={`container mx-auto max-w-7xl p-2 lg:p-4 flex-grow `}>
                <div className='grid grid-cols-10 h-full'>
                    <div
                        className={`hidden lg:col-span-2 lg:block relative`}
                    >
                        <Sidebar />

                        <div className="w-full flex items-center justify-center py-3 absolute bottom-0">
                            <Link
                                isExternal
                                className="flex items-center gap-1 text-current"
                                href="https://heroui.com"
                                title="heroui.com homepage"
                            >
                                <span className="text-default-600">Powered by</span>
                                <p className="text-primary">HeroUI</p>
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`${className} col-span-12 lg:col-span-8 rounded-2xl bg-[#F4F4F5]  dark:bg-[#0e0e0e]  border-[1px] border-zinc-300 dark:border-zinc-700 max-h-[95vh] overflow-auto scrollbar-hide `}
                    >
                        {children}
                    </div>
                </div>

            </main>

        </div>
    );
}
