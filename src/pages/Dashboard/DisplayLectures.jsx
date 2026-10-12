
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import {
    deleteCourseLecture,
    getCourseLecture,
} from "../../redux/slices/lectureSlice";

function DisplayLectures() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state: course } = useLocation();

    const { lectures, isLoading, isDeleting, error } = useSelector(
        (state) => state.lecture
    );
    const { role } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);

    const courseId = course?._id;

    useEffect(() => {
        if (!courseId) {
            navigate("/courses", { replace: true });
            return;
        }

        setCurrentVideo(0);
        dispatch(getCourseLecture(courseId));
    }, [dispatch, navigate, courseId]);

    useEffect(() => {
        if (currentVideo >= lectures.length) {
            setCurrentVideo(Math.max(0, lectures.length - 1));
        }
    }, [currentVideo, lectures.length]);

    async function onLectureDelete(lectureId) {
        if (!courseId || isDeleting) {
            return;
        }

        try {
            await dispatch(
                deleteCourseLecture({
                    courseId,
                    lectureId,
                })
            ).unwrap();

            await dispatch(getCourseLecture(courseId)).unwrap();
        } catch {
            // The Redux thunks display errors through toast notifications.
        }
    }

    if (!courseId) {
        return null;
    }

    const selectedLecture = lectures[currentVideo];
    const videoUrl = selectedLecture?.lecture?.secure_url;

    return (
        <HomeLayout>
            <main className="mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col gap-8 px-4 py-10 text-white sm:px-8 lg:px-10">
                <h1 className="break-words text-center text-2xl font-bold text-yellow-500 sm:text-3xl">
                    {course.title || "Course Lectures"}
                </h1>

                {isLoading && (
                    <p className="py-10 text-center text-gray-300" role="status">
                        Loading lectures...
                    </p>
                )}

                {!isLoading && error && (
                    <div className="flex flex-col items-center gap-4 py-8 text-center" role="alert">
                        <p className="text-red-400">{error}</p>
                        <button
                            type="button"
                            onClick={() => dispatch(getCourseLecture(courseId))}
                            className="rounded-md bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600"
                        >
                            Retry loading
                        </button>
                    </div>
                )}

                {!isLoading && !error && lectures.length === 0 && (
                    <section className="flex flex-col items-center gap-4 py-12 text-center">
                        <p className="text-gray-300">
                            No lectures have been added to this course yet.
                        </p>

                        {role === "ADMIN" && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/course/addlecture", {
                                        state: { ...course },
                                    })
                                }
                                className="rounded-md bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-600"
                            >
                                Add your first lecture
                            </button>
                        )}
                    </section>
                )}

                {!isLoading && !error && lectures.length > 0 && (
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
                        <section className="min-w-0 space-y-5 rounded-lg p-3 shadow-[0_0_10px_black] lg:col-span-3">
                            {videoUrl ? (
                                <video
                                    key={videoUrl}
                                    src={videoUrl}
                                    className="max-h-[65vh] w-full rounded-lg bg-black"
                                    controls
                                    playsInline
                                    controlsList="nodownload"
                                >
                                    Your browser does not support video playback.
                                </video>
                            ) : (
                                <div className="flex min-h-56 items-center justify-center rounded-lg bg-gray-900 p-4 text-center text-gray-300">
                                    Video unavailable for this lecture.
                                </div>
                            )}

                            <h2 className="break-words text-xl font-semibold">
                                <span className="text-yellow-500">Title: </span>
                                {selectedLecture?.title || "Untitled lecture"}
                            </h2>

                            <p className="whitespace-pre-line break-words leading-7 text-gray-300">
                                <span className="text-yellow-500">
                                    Description:{" "}
                                </span>
                                {selectedLecture?.description ||
                                    "No description available."}
                            </p>
                        </section>

                        <section className="min-w-0 rounded-lg p-3 shadow-[0_0_10px_black] lg:col-span-2">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-xl font-semibold text-yellow-500">
                                    Lectures ({lectures.length})
                                </h2>

                                {role === "ADMIN" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/course/addlecture", {
                                                state: { ...course },
                                            })
                                        }
                                        className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-600"
                                    >
                                        Add lecture
                                    </button>
                                )}
                            </div>

                            <ul className="space-y-3">
                                {lectures.map((lecture, index) => {
                                    const isSelected = index === currentVideo;

                                    return (
                                        <li
                                            key={lecture._id || `${lecture.title}-${index}`}
                                            className={`rounded-md border p-3 ${
                                                isSelected
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : "border-gray-700"
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setCurrentVideo(index)}
                                                aria-current={
                                                    isSelected ? "true" : undefined
                                                }
                                                className="w-full break-words text-left hover:text-yellow-400"
                                            >
                                                <span className="font-semibold">
                                                    Lecture {index + 1}:{" "}
                                                </span>
                                                {lecture.title || "Untitled lecture"}
                                            </button>

                                            {role === "ADMIN" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onLectureDelete(lecture._id)
                                                    }
                                                    disabled={isDeleting}
                                                    className="mt-3 rounded-md bg-red-700 px-3 py-1 text-sm font-semibold hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isDeleting
                                                        ? "Deleting..."
                                                        : "Delete lecture"}
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    </div>
                )}

                <Link
                    to="/courses"
                    className="self-start text-yellow-500 underline underline-offset-4 hover:text-yellow-400"
                >
                    Back to courses
                </Link>
            </main>
        </HomeLayout>
    );
}

export default DisplayLectures;
