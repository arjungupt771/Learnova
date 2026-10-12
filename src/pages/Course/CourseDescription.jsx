
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";

function CourseDescription() {
    const { state: course } = useLocation();
    const navigate = useNavigate();

    const { role, data } = useSelector((state) => state.auth);

    const isAdmin = role === "ADMIN";
    const hasActiveSubscription =
        data?.subscription?.status === "active";
    const canWatchLectures = isAdmin || hasActiveSubscription;

    if (!course || typeof course !== "object" || !course.title) {
        return (
            <HomeLayout>
                <main className="flex min-h-[80vh] flex-col items-center justify-center gap-5 px-4 text-center text-white">
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Course details unavailable
                    </h1>

                    <p className="max-w-md text-gray-300">
                        This page needs course information. Please return to
                        the course catalogue and select a course again.
                    </p>

                    <Link
                        to="/courses"
                        className="rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:bg-yellow-600"
                    >
                        Browse courses
                    </Link>
                </main>
            </HomeLayout>
        );
    }

    const thumbnailUrl = course.thumbnail?.secure_url;
    const lectureCount = Number(course.numberOfLectures);

    return (
        <HomeLayout>
            <main className="min-h-[90vh] px-4 py-10 text-white sm:px-8 lg:px-16 xl:px-20">
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
                    <section className="space-y-6">
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={`${course.title} course thumbnail`}
                                className="h-56 w-full rounded-lg border border-gray-700 bg-gray-900 object-contain sm:h-72"
                            />
                        ) : (
                            <div
                                className="flex h-56 w-full items-center justify-center rounded-lg border border-gray-700 bg-gray-900 text-gray-400 sm:h-72"
                                role="img"
                                aria-label="Course thumbnail unavailable"
                            >
                                No thumbnail available
                            </div>
                        )}

                        <div className="space-y-4 rounded-lg bg-gray-900/50 p-5">
                            <p className="text-lg font-semibold">
                                <span className="text-yellow-500">
                                    Total lectures:{" "}
                                </span>
                                {Number.isFinite(lectureCount) &&
                                lectureCount >= 0
                                    ? lectureCount
                                    : "Not available"}
                            </p>

                            <p className="text-lg font-semibold">
                                <span className="text-yellow-500">
                                    Instructor:{" "}
                                </span>
                                {course.createdBy || "Not specified"}
                            </p>

                            {course.category && (
                                <p className="text-lg font-semibold">
                                    <span className="text-yellow-500">
                                        Category:{" "}
                                    </span>
                                    {course.category}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    if (canWatchLectures) {
                                        navigate(
                                            "/course/displaylectures",
                                            { state: { ...course } }
                                        );
                                    } else {
                                        navigate("/checkout");
                                    }
                                }}
                                className="w-full rounded-md bg-yellow-500 px-5 py-3 text-lg font-bold text-black transition hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                {canWatchLectures
                                    ? "Watch Lectures"
                                    : "Subscribe to Access"}
                            </button>

                            {!canWatchLectures && (
                                <p className="text-center text-sm text-gray-400">
                                    An active subscription is required to
                                    access course lectures.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h1 className="break-words text-center text-3xl font-bold text-yellow-500 sm:text-4xl lg:text-left">
                            {course.title}
                        </h1>

                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-yellow-500">
                                About this course
                            </h2>

                            <p className="whitespace-pre-line break-words leading-7 text-gray-200">
                                {course.description ||
                                    "No description is available for this course yet."}
                            </p>
                        </div>

                        <Link
                            to="/courses"
                            className="inline-block text-yellow-500 underline underline-offset-4 transition hover:text-yellow-400"
                        >
                            Back to all courses
                        </Link>
                    </section>
                </div>
            </main>
        </HomeLayout>
    );
}

export default CourseDescription;
