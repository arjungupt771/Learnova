
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import {
    getRazorPayId,
    purchaseCourseBundle,
    verifyUserPayment,
} from "../../redux/slices/razorPaySlice";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const razorpayKey = useSelector((state) => state?.razorpay?.key);
    const subscriptionId = useSelector(
        (state) => state?.razorpay?.subscription_id
    );

    const [isPreparing, setIsPreparing] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [preparationError, setPreparationError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function prepareCheckout() {
            setIsPreparing(true);
            setPreparationError("");

            try {
                await dispatch(getRazorPayId()).unwrap();
                await dispatch(purchaseCourseBundle()).unwrap();
            } catch (error) {
                const message =
                    error?.message ||
                    "Unable to prepare checkout. Please try again.";

                if (isMounted) {
                    setPreparationError(message);
                    toast.error(message);
                }
            } finally {
                if (isMounted) {
                    setIsPreparing(false);
                }
            }
        }

        prepareCheckout();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    async function handleSubscription(event) {
        event.preventDefault();

        if (isPreparing || isVerifying) {
            return;
        }

        if (preparationError || !razorpayKey || !subscriptionId) {
            toast.error(
                "Checkout is not ready. Please retry checkout preparation."
            );
            return;
        }

        if (typeof window.Razorpay !== "function") {
            toast.error(
                "Payment service is unavailable. Please try again later."
            );
            return;
        }

        const options = {
            key: razorpayKey,
            subscription_id: subscriptionId,
            name: "Courses Pvt Ltd",
            description: "Annual course subscription",
            theme: {
                color: "#F37254",
            },
            handler: async (response) => {
                if (
                    !response?.razorpay_payment_id ||
                    !response?.razorpay_subscription_id ||
                    !response?.razorpay_signature
                ) {
                    toast.error(
                        "Payment details were incomplete. Please check your payment status."
                    );
                    return;
                }

                setIsVerifying(true);

                try {
                    const result = await dispatch(
                        verifyUserPayment({
                            razorpay_payment_id:
                                response.razorpay_payment_id,
                            razorpay_subscription_id:
                                response.razorpay_subscription_id,
                            razorpay_signature:
                                response.razorpay_signature,
                        })
                    ).unwrap();

                    if (result?.success !== true) {
                        throw new Error(
                            "The server did not confirm successful payment verification."
                        );
                    }

                    toast.success("Payment verified successfully.");
                    navigate("/checkout/success", { replace: true });
                } catch (error) {
                    toast.error(
                        error?.message ||
                        "Payment verification could not be confirmed. If money was deducted, contact support before retrying."
                    );
                } finally {
                    setIsVerifying(false);
                }
            },
            modal: {
                ondismiss: () => {
                    toast("Checkout closed. Check your payment status if needed.");
                },
            },
        };

        try {
            const paymentOptions = new window.Razorpay(options);

            paymentOptions.on("payment.failed", (event) => {
                const description = event?.error?.description;

                toast.error(
                    description || "The payment attempt failed. You can try again."
                );
            });

            paymentOptions.open();
        } catch {
            toast.error("Unable to open the payment window.");
        }
    }

    async function handleRetryPreparation() {
        setIsPreparing(true);
        setPreparationError("");

        try {
            await dispatch(getRazorPayId()).unwrap();
            await dispatch(purchaseCourseBundle()).unwrap();
        } catch (error) {
            const message =
                error?.message ||
                "Unable to prepare checkout. Please try again.";

            setPreparationError(message);
            toast.error(message);
        } finally {
            setIsPreparing(false);
        }
    }

    return (
        <HomeLayout>
            <form
                onSubmit={handleSubscription}
                className="flex min-h-[90vh] items-center justify-center px-4 text-white"
            >
                <div className="relative flex min-h-[26rem] w-full max-w-sm flex-col justify-center rounded-lg shadow-[0_0_10px_black]">
                    <h1 className="absolute top-0 w-full rounded-t-lg bg-yellow-500 py-4 text-center text-2xl font-bold">
                        Subscription Bundle
                    </h1>

                    <div className="space-y-5 px-4 pt-16 text-center">
                        <p className="text-[17px]">
                            Get access to all available courses for{" "}
                            <span className="font-bold text-yellow-500">
                                1 year
                            </span>
                            . Existing and newly launched courses are included.
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee />
                            <span>499</span> only
                        </p>

                        <div className="text-gray-200">
                            <p>Refunds are subject to the applicable policy.</p>
                            <p>Terms and conditions apply.</p>
                        </div>

                        {preparationError && (
                            <div className="space-y-2 text-sm text-red-300">
                                <p>{preparationError}</p>
                                <button
                                    type="button"
                                    onClick={handleRetryPreparation}
                                    disabled={isPreparing}
                                    className="underline disabled:opacity-60"
                                >
                                    Retry checkout preparation
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isPreparing ||
                                isVerifying ||
                                Boolean(preparationError)
                            }
                            className="absolute bottom-0 left-0 w-full rounded-b-lg bg-yellow-500 py-3 text-xl font-bold transition-colors duration-300 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPreparing
                                ? "Preparing checkout..."
                                : isVerifying
                                  ? "Verifying payment..."
                                  : "Buy now"}
                        </button>
                    </div>
                </div>
            </form>
        </HomeLayout>
    );
}

export default Checkout;
