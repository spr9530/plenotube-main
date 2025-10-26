
import { SearchIcon } from "./icons";

export default function Search() {
    return (
        <div className="flex gap-4 w-full p-1 px-6 grid-col-12 border-2 border-[#D4D4D8] dark:border-[#27272A] rounded-full items-center">
            <div className="col-span-2"><span><SearchIcon/></span></div>
            <div className="col-span-10 w-full">
                <input type="text"
                    className={`p-2 w-full border-none outline-none`}
                    placeholder="Search Your Interest"
                />
            </div>
        </div>
    );
}
