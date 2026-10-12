
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { createNewCourse } from "../../redux/slices/courseSlice";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialFormState = {
    title: "",
    description: "",
    category: "",
    createdBy: "",
    thumbnail: null,
    previewImage: "",
};

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleUserInput(event) {
        const { name, value } = event.target;

        setUserInput((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleImageUpload(event) {
        const uploadedImage = event.target.files?.[0];

        if (!uploadedImage) {
            return;
        }

        if (
            !["image/jpeg", "image/png", "image/webp"].includes(
                uploadedImage.type
            )
        ) {
            toast.error("Please upload a JPG, PNG, or WebP image.");
            event.target.value = "";
            return;
        }

        if (uploadedImage.size > MAX_IMAGE_SIZE) {
            toast.error("The thumbnail must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (typeof fileReader.result !== "string") {
                toast.error("Unable to preview the selected image.");
                return;
            }

            setUserInput((previous) => ({
                ...previous,
                thumbnail: uploadedImage,
                previewImage: fileReader.result,
            }));
        };

        fileReader.onerror = () => {
            toast.error("Unable to read the selected image.");
        };

        fileReader.readAsDataURL(uploadedImage);
    }

    async function onFormSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const title = userInput.title.trim();
        const description = userInput.description.trim();
        const category = userInput.category.trim();
        const createdBy = userInput.createdBy.trim();

        if (!title || !description || !category || !createdBy) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (!userInput.thumbnail) {
            toast.error("Please upload a course thumbnail.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await dispatch(
                createNewCourse({
                    title,
                    description,
                    category,
                    createdBy,
                    thumbnail: userInput.thumbnail,
                })
            ).unwrap();

            if (result?.success !== true) {
                toast.error(
                    result?.message || "The course could not be created."
                );
                return;
            }

            setUserInput({ ...initialFormState });
            toast.success("Course created successfully.");
            navigate("/courses");
        } catch {
            // The Redux thunk already displays the API error toast.
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <HomeLayout>
            <main className="min-h-[90vh] px-4 py-10 text-white sm:px-8">
                <form
                    onSubmit={onFormSubmit}
                    className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-lg p-5 shadow-[0_0_10px_black] sm:p-8"
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="absolute left-5 top-5 text-2xl text-yellow-500 transition hover:text-yellow-400"
                    >
                        <AiOutlineArrowLeft />
                    </button>

                    <h1 className="pt-5 text-center text-2xl font-bold sm:text-3xl">
                        Create New Course
                    </h1>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label
                                    htmlFor="image_uploads"
                                    className="mb-2 block font-semibold"
                                >
                                    Course thumbnail
                                </label>

                                <label
                                    htmlFor="image_uploads"
                                    className="flex min-h-48 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-500 bg-gray-900 transition hover:border-yellow-500"
                                >
                                    {userInput.previewImage ? (
                                        <img
                                            src={userInput.previewImage}
                                            alt="Course thumbnail preview"
                                            className="h-48 w-full object-contain"
                                        />
                                    ) : (
                                        <span className="px-4 text-center text-gray-300">
                                            Click to upload an image
                                            <span className="mt-2 block text-sm text-gray-400">
                                                JPG, PNG, or WebP · Max 5 MB
                                            </span>
                                        </span>
                                    )}
                                </label>

                                <input
                                    className="sr-only"
                                    type="file"
                                    id="image_uploads"
                                    accept="image/jpeg,image/png,image/webp"
                                    name="thumbnail"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="title"
                                    className="font-semibold"
                                >
                                    Course title
                                </label>
                                <input
                                    required
                                    maxLength={120}
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter the course title"
                                    onChange={handleUserInput}
                                    value={userInput.title}
                                    className="rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="createdBy"
                                    className="font-semibold"
                                >
                                    Instructor
                                </label>
                                <input
                                    required
                                    maxLength={100}
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter the instructor's name"
                                    onChange={handleUserInput}
                                    value={userInput.createdBy}
                                    className="rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="category"
                                    className="font-semibold"
                                >
                                    Category
                                </label>
                                <input
                                    required
                                    maxLength={80}
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="e.g. Web Development"
                                    onChange={handleUserInput}
                                    value={userInput.category}
                                    className="rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="description"
                                    className="font-semibold"
                                >
                                    Description
                                </label>
                                <textarea
                                    required
                                    maxLength={3000}
                                    name="description"
                                    id="description"
                                    placeholder="Describe what students will learn"
                                    onChange={handleUserInput}
                                    value={userInput.description}
                                    rows={5}
                                    className="resize-y rounded border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-yellow-600 py-3 text-lg font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating course..." : "Create Course"}
                    </button>
                </form>
            </main>
        </HomeLayout>
    );
}

export default CreateCourse;
