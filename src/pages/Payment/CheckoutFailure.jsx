
import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";

function CheckoutFailure() {
    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10 text-white">
                <section className="relative flex min-h-[26rem] w-full max-w-sm flex-col items-center justify-center rounded-lg shadow-[0_0_10px_black]">
                    <h1 className="absolute top-0 w-full rounded-t-lg bg-red-600 py-4 text-center text-2xl font-bold">
                        Payment not completed
                    </h1>

                    <div className="flex flex-col items-center gap-4 px-6 pt-12 text-center">
                        <RxCrossCircled
                            className="text-6xl text-red-500"
                            aria-hidden="true"
                        />

                        <h2 className="text-xl font-semibold">
                            We couldn&apos;t complete your payment.
                        </h2>

                        <p className="text-gray-300">
                            You can return to checkout to try again. If money
                            was deducted, check your payment status or contact
                            support before attempting another payment.
                        </p>
                    </div>

                    <Link
                        to="/checkout"
                        className="absolute bottom-12 w-full px-4 py-3 text-center font-semibold text-yellow-400 underline underline-offset-4 transition hover:text-yellow-300"
                    >
                        Return to checkout
                    </Link>

                    <Link
                        to="/"
                        className="absolute bottom-0 w-full rounded-b-lg bg-red-600 py-3 text-center font-semibold transition hover:bg-red-500"
                    >
                        Go to dashboard
                    </Link>
                </section>
            </main>
        </HomeLayout>
    );
}

export default CheckoutFailure;
