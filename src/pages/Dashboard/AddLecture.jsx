
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { addCourseLecture } from "../../redux/slices/lectureSlice";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

const initialFormState = {
    title: "",
    description: "",
    lecture: null,
    videoSrc: "",
};

function AddLecture() {
    const { state: courseDetails } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileError, setFileError] = useState("");
    const courseId = courseDetails?._id;

    useEffect(() => {
        if (!courseId) {
            navigate("/courses", { replace: true });
        }
    }, [courseId, navigate]);

    useEffect(() => {
        if (!userInput.lecture) {
            return undefined;
        }

        const videoUrl = URL.createObjectURL(userInput.lecture);

        setUserInput((previous) => ({
            ...previous,
            videoSrc: videoUrl,
        }));

        return () => {
            URL.revokeObjectURL(videoUrl);
        };
    }, [userInput.lecture]);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setUserInput((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleVideo(event) {
    const video = event.target.files?.[0];

    setFileError("");

    if (!video) return;

    if (!video.type.startsWith("video/")) {
        setFileError("Please select a valid video file.");
        event.target.value = "";
        setUserInput((previous) => ({
            ...previous,
            lecture: null,
            videoSrc: "",
        }));
        return;
    }

    if (video.size > MAX_VIDEO_SIZE) {
        setFileError("The video must be 500 MB or smaller.");
        event.target.value = "";
        setUserInput((previous) => ({
            ...previous,
            lecture: null,
            videoSrc: "",
        }));
        return;
    }

    setUserInput((previous) => ({
        ...previous,
        lecture: video,
        videoSrc: "",
    }));
}

    async function onFormSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const title = userInput.title.trim();
        const description = userInput.description.trim();

        if (!title || !description || !userInput.lecture) {
            return;
        }

        if (!courseId) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await dispatch(
                addCourseLecture({
                    id: courseId,
                    title,
                    description,
                    lecture: userInput.lecture,
                })
            ).unwrap();

            if (result?.success !== true) {
                return;
            }

            setUserInput({ ...initialFormState });
            navigate(-1);
        } catch {
            // The Redux thunk displays the API error notification.
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!courseId) {
        return null;
    }

    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10 text-white sm:px-6">
                <section className="w-full max-w-xl space-y-6 rounded-lg p-5 shadow-[0_0_10px_black] sm:p-8">
                    <header className="relative flex items-center justify-center">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="absolute left-0 text-2xl text-yellow-500 transition hover:text-yellow-400"
                        >
                            <AiOutlineArrowLeft />
                        </button>

                        <h1 className="px-8 text-center text-xl font-bold text-yellow-500 sm:text-2xl">
                            Add New Lecture
                        </h1>
                    </header>

                    <p className="break-words text-center text-sm text-gray-400">
                        Course: {courseDetails.title || "Selected course"}
                    </p>

                    <form
                        onSubmit={onFormSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="title"
                                className="font-semibold"
                            >
                                Lecture title
                            </label>

                            <input
                                required
                                maxLength={150}
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter the lecture title"
                                className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                value={userInput.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="description"
                                className="font-semibold"
                            >
                                Lecture description
                            </label>

                            <textarea
                                required
                                maxLength={3000}
                                name="description"
                                id="description"
                                placeholder="Describe what this lecture covers"
                                className="min-h-32 resize-y rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                                value={userInput.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label
                                htmlFor="lecture"
                                className="block font-semibold"
                            >
                                Video file
                            </label>

                            <input
                                required={!userInput.lecture}
                                type="file"
                                id="lecture"
                                name="lecture"
                                accept="video/*"
                                onChange={handleVideo}
                                className="block w-full cursor-pointer rounded border border-gray-600 p-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-yellow-500 file:px-3 file:py-2 file:font-semibold file:text-black"
                            />

                            <p className="text-sm text-gray-400">
                                Select a video file up to 500 MB. Upload limits
                                on the server may be lower.
                            </p>
                            {fileError && (
                                <p className="text-sm text-red-400" role="alert">
                                    {fileError}
                                    </p>
                                )}

                            {userInput.videoSrc && (
                                <video
                                    key={userInput.videoSrc}
                                    src={userInput.videoSrc}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className="max-h-80 w-full rounded-lg bg-black"
                                >
                                    Your browser does not support video playback.
                                </video>
                            )}

                            {userInput.lecture && (
                                <p className="break-all text-sm text-gray-300">
                                    Selected: {userInput.lecture.name}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-yellow-600 py-3 text-lg font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Uploading lecture..."
                                : "Add Lecture"}
                        </button>
                    </form>
                </section>
            </main>
        </HomeLayout>
    );
}

export default AddLecture;
