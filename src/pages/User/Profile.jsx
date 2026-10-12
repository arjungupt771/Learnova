
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { getUserData } from "../../redux/slices/authSlice";
import { cancelCourseBundle } from "../../redux/slices/razorPaySlice";

function Profile() {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.data);
    const [isCancelling, setIsCancelling] = useState(false);

    const isSubscribed = userData?.subscription?.status === "active";

    async function handleCancellation() {
        if (isCancelling) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel your subscription?"
        );

        if (!confirmed) {
            return;
        }

        setIsCancelling(true);

        try {
            await dispatch(cancelCourseBundle()).unwrap();

            toast.success("Subscription cancellation completed.");

            try {
                await dispatch(getUserData()).unwrap();
            } catch {
                toast.error(
                    "Your cancellation was submitted, but profile details could not be refreshed. Please reload the page."
                );
            }
        } catch {
            // The failed cancellation is handled by the caller's error feedback.
            toast.error(
                "Subscription cancellation failed. Please try again."
            );
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10">
                <section className="my-6 flex w-full max-w-md flex-col gap-5 rounded-lg p-6 text-white shadow-[0_0_10px_black] sm:p-8">
                    {userData?.avatar?.secure_url ? (
                        <img
                            src={userData.avatar.secure_url}
                            alt={`${userData.fullName || "User"}'s profile`}
                            className="mx-auto h-32 w-32 rounded-full border border-gray-600 object-cover"
                        />
                    ) : (
                        <div
                            className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-gray-600 bg-gray-900 text-center text-sm text-gray-400"
                            role="img"
                            aria-label="No profile image"
                        >
                            No profile image
                        </div>
                    )}

                    <h1 className="break-words text-center text-2xl font-bold capitalize">
                        {userData?.fullName || "User Profile"}
                    </h1>

                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3">
                        <dt className="font-semibold text-yellow-500">
                            Email
                        </dt>
                        <dd className="break-all text-gray-200">
                            {userData?.email || "Not available"}
                        </dd>

                        <dt className="font-semibold text-yellow-500">
                            Role
                        </dt>
                        <dd className="break-words text-gray-200">
                            {userData?.role || "Not available"}
                        </dd>

                        <dt className="font-semibold text-yellow-500">
                            Subscription
                        </dt>
                        <dd className="text-gray-200">
                            {isSubscribed ? "Active" : "Inactive"}
                        </dd>
                    </dl>

                    <Link
                        to="/user/editprofile"
                        className="w-full rounded-md bg-yellow-600 py-3 text-center font-semibold text-black transition hover:bg-yellow-500"
                    >
                        Edit Profile
                    </Link>

                    {isSubscribed && (
                        <button
                            type="button"
                            onClick={handleCancellation}
                            disabled={isCancelling}
                            className="w-full rounded-md bg-red-700 py-3 font-semibold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCancelling
                                ? "Cancelling subscription..."
                                : "Cancel Subscription"}
                        </button>
                    )}
                </section>
            </main>
        </HomeLayout>
    );
}

export default Profile;
