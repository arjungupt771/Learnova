
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { getUserData } from "../../redux/slices/authSlice";

function CheckoutSuccess() {
    const dispatch = useDispatch();

    const isPaymentVerified = useSelector(
        (state) => state.razorpay.isPaymentVerified
    );
    const userData = useSelector((state) => state.auth.data);
    const isSubscribed = userData?.subscription?.status === "active";

    const [isChecking, setIsChecking] = useState(true);
    const [checkFailed, setCheckFailed] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function refreshUserData() {
            try {
                await dispatch(getUserData()).unwrap();
            } catch {
                if (isMounted) {
                    setCheckFailed(true);
                }
            } finally {
                if (isMounted) {
                    setIsChecking(false);
                }
            }
        }

        refreshUserData();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    const isConfirmed = isPaymentVerified || isSubscribed;

    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10 text-white">
                <section
                    className="relative flex min-h-[26rem] w-full max-w-sm flex-col items-center justify-center rounded-lg shadow-[0_0_10px_black]"
                    aria-live="polite"
                >
                    <h1
                        className={`absolute top-0 w-full rounded-t-lg py-4 text-center text-xl font-bold sm:text-2xl ${
                            isConfirmed
                                ? "bg-green-600"
                                : "bg-yellow-600"
                        }`}
                    >
                        {isConfirmed
                            ? isPaymentVerified
                                ? "Payment verified"
                                : "Subscription active"
                            : "Payment status"}
                    </h1>

                    <div className="flex flex-col items-center gap-4 px-6 pt-12 text-center">
                        {isConfirmed ? (
                            <>
                                <AiFillCheckCircle
                                    className="text-6xl text-green-500"
                                    aria-hidden="true"
                                />
                                <h2 className="text-xl font-semibold">
                                    {isPaymentVerified
                                        ? "Payment successful!"
                                        : "Your subscription is active"}
                                </h2>
                                <p className="text-gray-300">
                                    {isPaymentVerified
                                        ? "Your payment has been verified. You can now enjoy your premium course content."
                                        : "Your account currently has an active subscription."}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-semibold">
                                    {isChecking
                                        ? "Checking your payment status..."
                                        : "We couldn't confirm your payment yet."}
                                </p>
                                <p className="text-sm text-gray-300">
                                    {isChecking
                                        ? "Please wait while we refresh your account details."
                                        : checkFailed
                                          ? "We couldn't refresh your account details. If money was deducted, please check your payment status or contact support before trying again."
                                          : "Your account doesn't currently show an active subscription. If money was deducted, contact support before making another payment."}
                                </p>
                            </>
                        )}
                    </div>

                    <Link
                        to={isConfirmed ? "/" : "/user/profile"}
                        className="absolute bottom-0 w-full rounded-b-lg bg-yellow-500 px-4 py-3 text-center font-semibold text-black transition hover:bg-yellow-400"
                    >
                        {isConfirmed
                            ? "Go to dashboard"
                            : "Check my profile"}
                    </Link>
                </section>
            </main>
        </HomeLayout>
    );
}

export default CheckoutSuccess;
