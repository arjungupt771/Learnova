
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CourseCard from "../../components/CourseCard";
import HomeLayout from "../../layouts/HomeLayout";
import { getAllCourses } from "../../redux/slices/courseSlice";

function CourseList() {
    const dispatch = useDispatch();

    const { courseList, isLoading, error } = useSelector(
        (state) => state.course
    );

    useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch]);

    return (
        <HomeLayout>
            <main className="min-h-[90vh] px-4 pt-12 text-white sm:px-8 lg:px-20">
                <h1 className="mb-10 text-center text-3xl font-semibold sm:text-4xl">
                    Explore courses made by{" "}
                    <span className="font-bold text-yellow-500">
                        Industry experts
                    </span>
                </h1>

                {isLoading && (
                    <p
                        className="py-12 text-center text-gray-300"
                        role="status"
                    >
                        Loading courses...
                    </p>
                )}

                {!isLoading && error && (
                    <div
                        className="flex flex-col items-center gap-4 py-12 text-center"
                        role="alert"
                    >
                        <p className="text-red-400">{error}</p>

                        <button
                            type="button"
                            onClick={() => dispatch(getAllCourses())}
                            className="rounded-md bg-yellow-500 px-5 py-2 font-semibold text-black transition hover:bg-yellow-600"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !error && courseList.length === 0 && (
                    <p className="py-12 text-center text-gray-300">
                        No courses are available right now.
                    </p>
                )}

                {!isLoading && !error && courseList.length > 0 && (
                    <div className="mb-10 flex flex-wrap justify-center gap-8 lg:gap-14">
                        {courseList.map((course) => (
                            <CourseCard
                                key={course._id}
                                data={course}
                            />
                        ))}
                    </div>
                )}
            </main>
        </HomeLayout>
    );
}

export default CourseList;
