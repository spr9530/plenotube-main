import React, { useEffect, useState } from 'react'
import MainLayout from '../../layouts/Main'
import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { FaBookOpen, FaChevronLeft } from 'react-icons/fa'
import SectionTopBack from '../../components/SectionTopBack'
import TableComponent, { SearchIcon } from '../../components/Table'
import { Input, Textarea } from '@heroui/input'
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import InfoCard from '../../components/Card'
import CardSkeleton from '../../components/cardSkeleton'
import { Image } from '@heroui/image'
import { FaCamera } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { useCampaignContext } from '../../context/CampaignContext'
import generateToast from '../../toast/GenrateToast'
import useUser from '../../hooks/useUser'
import { useAuth } from '../../context/AuthContext'

function UserCampaign() {
    const [showForm, setShowForm] = useState(false);

    const { getUserCampaigns, userCampaign, loading } = useCampaignContext();
    const { userInfo } = useAuth();

    useEffect(() => {
        if (userInfo) {
            getUserCampaigns();
        }
    }, [userInfo]);

    console.log(userCampaign)

    return (
        <>
            <MainLayout>
                <div className='w-full max-h-full overflow-auto custom-scroll'>
                    {showForm ? <div className='w-full max-h-full overflow-auto custom-scroll'>
                        <div className='p-3'>
                            <Button size='sm' radius='full' variant='bordered' onPress={() => setShowForm(false)} className='flex gap-2'><FaChevronLeft />Back</Button>
                        </div>
                        <Divider />
                    </div> : <SectionTopBack />}
                    {showForm ?
                        <SubmissionForm setShowForm={setShowForm} />
                        :
                        <>
                            {loading ? <>
                                <div className='grid grid-cols-12 gap-2 '>

                                    <div className='col-span-4'>
                                        <CardSkeleton />
                                    </div>
                                    <div className='col-span-4'>
                                        <CardSkeleton />
                                    </div>
                                    <div className='col-span-4'>
                                        <CardSkeleton />
                                    </div>

                                </div>
                            </> :
                                <>
                                    <div className='p-4 flex gap-2 w-full justify-between items-center'>
                                        <div className=' max-h-full overflow-auto custom-scroll w-full'>
                                            <div className='flex flex-col gap-2 justify-between'>
                                                <div className='font-semibold'>My Campaigns</div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-default-400 text-small">Total Campaign : 0</span>
                                            </div>
                                        </div>

                                        <div className="flex w-full max-w-[700px] gap-3 ">
                                            <div className="flex justify-end gap-3 w-full">
                                                <Input
                                                    isClearable
                                                    className="w-full "
                                                    placeholder="Search by name..."
                                                    startContent={<SearchIcon />}
                                                // value={filterValue}
                                                // onClear={() => onClear()}
                                                // onValueChange={onSearchChange}
                                                />
                                            </div>
                                            <Button color="primary" variant="flat" className='px-8' onPress={() => setShowForm(true)}>
                                                Add Campaign
                                            </Button>
                                        </div>
                                    </div>
                                    {userCampaign && userCampaign.length >= 1 ? <>
                                        <div className='mt-5 grid md:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-3 w-full p-4 h-full'>
                                            {userCampaign?.map((campaign, index) => (
                                                <div key={index} className='col-span-4'>
                                                    <InfoCard
                                                        title={campaign.title}
                                                        platforms={campaign.platforms}
                                                        reward={campaign.reward}
                                                        budget={campaign.budget}
                                                        paid={2000}
                                                        createdBy={'Jhon deo'}
                                                        views={100000}
                                                        description={campaign.description}
                                                    />
                                                </div>
                                            ))}


                                        </div>
                                    </> :
                                        <div className="flex flex-col justify-center text-center items-center mt-4 w-full ">
                                            <img src='/images/no-campaign2.png' alt='No submission' className='mx-auto mb-4 h-50 ' />
                                            <div className="font-semibold text-[40px] text-white">
                                                No <span className="text-warning">Campaign</span> Created
                                            </div>
                                            <div className="text-md font-semibold text-zinc-600">
                                                Start submitting content to earn money!
                                            </div>
                                        </div>
                                    }

                                </>
                            }
                        </>
                    }
                </div>
            </MainLayout >
        </>
    )
}

const categories = [
    { key: "tech", label: "Technology" },
    { key: "fashion", label: "Fashion" },
    { key: "gaming", label: "Gaming" },
    { key: "fitness", label: "Fitness" },
];


function SubmissionForm({ setShowForm }) {
    const [preview, setPreview] = useState(
        "https://heroui.com/images/hero-card-complete.jpeg"
    );
    const [requirements, setRequirements] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [budget, setBudget] = useState(null);
    const [perView, setPerView] = useState(null);
    const [minPayout, setMinPayout] = useState(null);

    const { createCampaign, loading } = useCampaignContext();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm();

    // 📸 Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            generateToast({ title: 'Invalid File', message: 'Only image files are allowed (JPEG, PNG, etc.)', type: 'warning' });
            e.target.value = null; // clear invalid file
            return;
        }
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    // ➕ Handle Requirements
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed && trimmed.length > 15) {
                setRequirements((prev) => [...prev, trimmed]);
                setInputValue("");
            }
        }
    };

    const handleRemove = (index) => {
        setRequirements((prev) => prev.filter((_, i) => i !== index));
    };

    // ✅ Submit Handler
    const onSubmit = async (data) => {
        if (requirements.length < 3) {
            alert("Please add at least 3 requirements.");
            return;
        }

        if (!imageFile) {
            alert("Campaign Image is required.");
            return;
        }

        // 🧠 Create FormData (used for file + text data)
        const formData = new FormData();

        // Append normal fields
        formData.append("title", data.title);
        formData.append("budget", data.budget);
        formData.append("description", data.description);
        formData.append("reward", data.reward);
        formData.append("per", data.per);
        formData.append("category", data.category);
        formData.append("maximumPayout", data.maximumPayout);
        formData.append("minimumPayout", data.minimumPayout);
        formData.append("requiredView", data.requiredView);
        formData.append("platforms", JSON.stringify(data.platforms)); // if array
        formData.append("requirements", JSON.stringify(requirements)); // array of strings

        // Append image file
        formData.append("imageFile", imageFile);

        console.log("📦 Sending FormData to backend...");

        // Call API (important: don't stringify FormData)
        const res = await createCampaign(formData);
        if (res) {
            setShowForm(false);

        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8 h-full overflow-auto custom-scroll p-4">
                {/* ---------- Header ---------- */}
                <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col justify-between">
                        <div className="font-semibold">My Campaigns</div>
                    </div>
                </div>

                {/* ---------- Image Upload ---------- */}
                <div className="flex justify-center w-full items-end gap-4">
                    {imageFile ? <>
                        <Image
                            className="object-cover rounded-xl min-w-70 max-w-100 max-h-[300px]"
                            alt="User uploaded preview"
                            src={preview}
                            width={400}
                        />
                        <div className="text-2xl cursor-pointer">
                            <label className="text-2xl cursor-pointer">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </> :
                        <div className='border-3 border-dashed border-zinc-700 rounded-xl h-52 w-96 flex justify-center items-center'>
                            <label className="text-6xl cursor-pointer">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    }
                </div>

                {/* ---------- Name & Budget ---------- */}
                <div className="flex gap-4">
                    <div className="flex flex-col justify-start w-full">
                        <label htmlFor='title' className="text-sm mb-2 font-semibold">Campaign Title</label>
                        <Input
                            id='title'
                            variant='fade'
                            placeholder="Enter Campaign Name"
                            {...register("title", { required: "Name is required" })}
                            className="bg-[#111] rounded-xl outline-none border border-zinc-800"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col justify-start w-full">
                        <label htmlFor='budget' className="text-sm mb-2 font-semibold">Budget (₹)</label>
                        <Input
                            id="budget"
                            type="number"
                            variant="fade"
                            placeholder="Enter Your Budget"
                            onChange={() => setBudget(e.target.value)}
                            {...register("budget", {
                                required: "Budget is required",
                                valueAsNumber: true, // converts string to number
                                min: {
                                    value: 5000,
                                    message: "Budget must be at least 5000",
                                },
                            })}
                            className="bg-[#111] rounded-xl outline-none border border-zinc-800"
                        />
                        {errors.budget && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.budget.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* ---------- Description ---------- */}
                <div className='flex flex-col justify-start'>
                    <label htmlFor="description" className='text-sm mb-2 font-semibold'>Description</label>
                    <Textarea
                        id="description"
                        labelPlacement='outside-top'
                        placeholder="Describe your campaign"
                        {...register("description", {
                            required: "Description is required",
                            minLength: {
                                value: 150,
                                message: "Description must be at least 150 characters long",
                            },
                        })}
                        type="text"
                        variant='fade'
                        className='bg-[#111] rounded-xl outline-none border border-zinc-800 py-2'
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* ---------- Rewards & Payout ---------- */}
                <div className="flex gap-4">
                    <div className="flex gap-4 w-full">
                        <div className="flex flex-col justify-start w-full">
                            <label htmlFor='reward' className="text-sm mb-2 font-semibold">Reward (₹) per 1k </label>
                            <Input
                                id='reward'
                                variant='fade'
                                placeholder="₹ Reward For User"
                                {...register("reward", {
                                    required: "Reward is required",
                                    pattern: { value: /^[0-9]+$/, message: "Must be a number" },
                                    validate: (value) =>
                                        parseFloat(value) >= budget / 3 || "At least 3 users must be paid",
                                })}
                                type='Number'
                                className="bg-[#111] rounded-xl outline-none border border-zinc-800"
                            />
                            {errors.reward && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.reward.message}
                                </p>
                            )}
                        </div>

                    </div>

                <div className="flex gap-4 w-full">
  {/* Minimum Payout */}
  <div className="flex flex-col justify-start w-full">
    <label htmlFor="minimumPayout" className="text-sm mb-2 font-semibold">
      Minimum Payout (₹)
    </label>
    <Input
      id="minimumPayout"
      variant="fade"
      placeholder="Minimum ₹20"
      type="number"
      {...register("minimumPayout", {
        required: "Minimum payout is required",
        pattern: { value: /^[0-9]+$/, message: "Must be a number" },
        validate: (value) =>
          parseFloat(value) >= budget / 3 ||
          "Minimum payout must be enough for at least 3 users",
      })}
      onChange={(e) => setMinPayout(parseFloat(e.target.value) || 0)}
      className="bg-[#111] rounded-xl outline-none border border-zinc-800"
    />
    {errors.minimumPayout && (
      <p className="text-red-500 text-xs mt-1">
        {errors.minimumPayout.message}
      </p>
    )}
  </div>

  {/* Maximum Payout */}
  <div className="flex flex-col justify-start w-full">
    <label htmlFor="maximumPayout" className="text-sm mb-2 font-semibold">
      Maximum Payout (₹)
    </label>
    <Input
      id="maximumPayout"
      variant="fade"
      placeholder="Maximum ₹1000"
      type="number"
      {...register("maximumPayout", {
        required: "Maximum payout is required",
        pattern: { value: /^[0-9]+$/, message: "Must be a number" },
        validate: (value) =>
          parseFloat(value) >= parseFloat(watch("minimumPayout") || 0) ||
          "Maximum payout must be greater than minimum payout",
      })}
      className="bg-[#111] rounded-xl outline-none border border-zinc-800"
    />
    {errors.maximumPayout && (
      <p className="text-red-500 text-xs mt-1">
        {errors.maximumPayout.message}
      </p>
    )}
  </div>
</div>

                </div>

                {/* ---------- Category & Platforms ---------- */}
                <div className="flex gap-4">
                    <div className="flex flex-col justify-start w-[40%]">
                        <label htmlFor='requiredView' className="text-sm mb-2 font-semibold"> Total Required views</label>
                        <Input
                            id='requiredView'
                            variant='fade'
                            placeholder="100k Views"
                            type='number'
                            {...register("requiredView", {
                                required: "Required views are required",
                                pattern: { value: /^[0-9]+$/, message: "Must be a number" },
                                validate: (value) => value > perView || "Must be greater than per-view value",
                            })}
                            className="bg-[#111] rounded-xl outline-none border border-zinc-800"
                        />
                        {errors.requiredView && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.requiredView.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col justify-start w-full">
                        <label aria-label='Category' className="text-sm mb-2 font-semibold">Category</label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select
                                    variant='fade'
                                    placeholder="Select a category"
                                    {...field}
                                    className="bg-[#111] rounded-xl outline-none border border-zinc-800"
                                >
                                    {categories.map((c) => (
                                        <SelectItem key={c.key}>{c.label}</SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col justify-start w-full">
                        <label aria-label='platforms' className="text-sm mb-2 font-semibold">Platforms</label>
                        <div className="w-full flex gap-4 h-full items-center">
                            <label>
                                <Checkbox
                                    type="checkbox"
                                    {...register("platforms", { required: "Select at least one platform" })}
                                    value="Instagram"
                                />{" "}
                                Instagram
                            </label>
                            <label>
                                <Checkbox
                                    type="checkbox"
                                    {...register("platforms")}
                                    value="Facebook"
                                />{" "}
                                Facebook
                            </label>
                            <label>
                                <Checkbox
                                    type="checkbox"
                                    {...register("platforms")}
                                    value="Youtube"
                                />{" "}
                                YouTube
                            </label>
                        </div>
                        {errors.platforms && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.platforms.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* ---------- Requirements ---------- */}
                <div className="flex flex-col justify-start">
                    <label htmlFor='requirements' className="text-sm mb-2 font-semibold">Requirements</label>
                    <div
                        className="bg-zinc-700 text-sm p-0.5 px-2 rounded-md flex items-center gap-2 mb-2 max-w-[fit-content]"
                    >
                        Key Requirements
                    </div>
                    <div className="flex mb-2 flex-wrap gap-2">
                        {requirements?.map((req, index) => (
                            <div
                                key={index}
                                className="bg-zinc-700 text-sm p-0.5 px-2 rounded-md flex items-center gap-2"
                            >
                                {req}
                                <span
                                    className="cursor-pointer hover:text-red-400"
                                    onClick={() => handleRemove(index)}
                                >
                                    ×
                                </span>
                            </div>
                        ))}
                    </div>
                    <Textarea
                        id='requirements'
                        placeholder="Elaborate the requirements and then press ↵"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        variant='fade'
                        className="bg-[#111] rounded-xl outline-none border border-zinc-800 py-2"
                    />
                    {requirements?.length < 3 && (
                        <p className="text-warning text-xs mt-1">
                            ⚠️ Add at least 3 requirements.
                        </p>
                    )}
                    {inputValue?.trim()?.length < 15 && (
                        <p className="text-warning text-xs mt-1">
                            ⚠️ Must be 15 Characters Long.
                        </p>
                    )}
                </div>

                {/* ---------- Buttons ---------- */}
                <div className="w-full flex gap-4">
                    <Button isLoading={loading} type="submit" color="primary" className="font-semibold w-full">
                        Save Campaign
                    </Button>
                    <Button
                        color="danger"
                        variant="flat"
                        className="font-semibold w-full"
                        onPress={() => setShowForm(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default UserCampaign