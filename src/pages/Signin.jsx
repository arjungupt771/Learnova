
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { isEmail } from "../helpers/regexMatcher";
import HomeLayout from "../layouts/HomeLayout";
import { login } from "../redux/slices/authSlice";

const initialSigninDetails = {
    email: "",
    password: "",
};

function Signin() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [signinDetails, setSigninDetails] = useState(initialSigninDetails);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleUserInput(event) {
        const { name, value } = event.target;

        setSigninDetails((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function onFormSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const email = signinDetails.email.trim();

        if (!email || !signinDetails.password) {
            toast.error("Please fill in all the fields.");
            return;
        }

        if (!isEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(
                login({
                    email,
                    password: signinDetails.password,
                })
            ).unwrap();

            const from = location.state?.from;

            const destination =
                from &&
                typeof from.pathname === "string" &&
                from.pathname.startsWith("/") &&
                !from.pathname.startsWith("//")
                    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
                    : "/";

            setSigninDetails({ ...initialSigninDetails });
            navigate(destination, { replace: true });
        } catch {
            // The login thunk already displays the API error notification.
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <HomeLayout>
            <main className="flex min-h-[85vh] items-center justify-center px-4 py-10">
                <form
                    onSubmit={onFormSubmit}
                    noValidate
                    className="flex w-full max-w-md flex-col gap-5 rounded-lg p-6 text-white shadow-[0_0_10px_black] sm:p-8"
                >
                    <h1 className="text-center text-3xl font-bold">
                        Sign In
                    </h1>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>

                        <input
                            autoComplete="email"
                            required
                            type="email"
                            name="email"
                            id="email"
                            value={signinDetails.email}
                            onChange={handleUserInput}
                            placeholder="Enter your email"
                            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-semibold">
                            Password
                        </label>

                        <input
                            autoComplete="current-password"
                            required
                            type="password"
                            name="password"
                            id="password"
                            value={signinDetails.password}
                            onChange={handleUserInput}
                            placeholder="Enter your password"
                            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 rounded bg-yellow-700 py-3 text-lg font-semibold text-white transition hover:bg-yellow-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-gray-300">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-yellow-500 underline underline-offset-4 hover:text-yellow-400"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </main>
        </HomeLayout>
    );
}

export default Signin;
