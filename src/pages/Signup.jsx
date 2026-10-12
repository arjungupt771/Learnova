
import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isValidPassword } from "../helpers/regexMatcher";
import HomeLayout from "../layouts/HomeLayout";
import { createAccount } from "../redux/slices/authSlice";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const initialSignupDetails = {
    email: "",
    fullName: "",
    password: "",
    avatar: null,
};

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signupDetails, setSignupDetails] = useState(initialSignupDetails);
    const [previewImage, setPreviewImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleUserInput(event) {
        const { name, value } = event.target;

        setSignupDetails((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleImage(event) {
        const uploadedImage = event.target.files?.[0];

        if (!uploadedImage) {
            return;
        }

        const acceptedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml",
        ];

        if (!acceptedTypes.includes(uploadedImage.type)) {
            toast.error("Please select a JPG, PNG, WebP, or SVG image.");
            event.target.value = "";
            return;
        }

        if (uploadedImage.size > MAX_AVATAR_SIZE) {
            toast.error("Your profile image must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            if (typeof fileReader.result !== "string") {
                toast.error("Unable to preview the selected image.");
                return;
            }

            setSignupDetails((previous) => ({
                ...previous,
                avatar: uploadedImage,
            }));

            setPreviewImage(fileReader.result);
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

        const fullName = signupDetails.fullName.trim();
        const email = signupDetails.email.trim();

        if (!fullName || !email || !signupDetails.password) {
            toast.error("Please complete all required fields.");
            return;
        }

        if (fullName.length < 5) {
            toast.error("Your name must contain at least 5 characters.");
            return;
        }

        if (!isEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!isValidPassword(signupDetails.password)) {
            toast.error(
                "Password must be 6–16 characters long and include a number and a special character."
            );
            return;
        }

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", signupDetails.password);

        if (signupDetails.avatar) {
            formData.append("avatar", signupDetails.avatar);
        }

        setIsSubmitting(true);

        try {
            await dispatch(createAccount(formData)).unwrap();

            setSignupDetails({ ...initialSignupDetails });
            setPreviewImage("");

            navigate("/signin", { replace: true });
        } catch {
            // The registration thunk already displays the API error notification.
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
                        Create Your Account
                    </h1>

                    <div className="flex flex-col items-center gap-2">
                        <label
                            htmlFor="image_uploads"
                            className="cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-yellow-500"
                            title="Choose a profile image"
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Profile image preview"
                                    className="h-24 w-24 rounded-full border border-gray-600 object-cover"
                                />
                            ) : (
                                <BsPersonCircle
                                    aria-hidden="true"
                                    className="h-24 w-24 text-gray-300"
                                />
                            )}
                        </label>

                        <label
                            htmlFor="image_uploads"
                            className="cursor-pointer text-sm text-yellow-500 hover:text-yellow-400"
                        >
                            Add a profile image (optional)
                        </label>

                        <input
                            onChange={handleImage}
                            type="file"
                            className="sr-only"
                            name="image_uploads"
                            id="image_uploads"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        />

                        <p className="text-xs text-gray-400">
                            JPG, PNG, WebP, or SVG · Max 5 MB
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="fullName" className="font-semibold">
                            Full name
                        </label>

                        <input
                            autoComplete="name"
                            required
                            maxLength={100}
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={signupDetails.fullName}
                            onChange={handleUserInput}
                            placeholder="Enter your full name"
                            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                        />
                    </div>

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
                            value={signupDetails.email}
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
                            autoComplete="new-password"
                            required
                            type="password"
                            name="password"
                            id="password"
                            value={signupDetails.password}
                            onChange={handleUserInput}
                            placeholder="Create a password"
                            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                        />

                        <p className="text-xs text-gray-400">
                            Use 6–16 characters, including a number and a
                            special character.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 rounded bg-yellow-700 py-3 text-lg font-semibold text-white transition hover:bg-yellow-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                    <p className="text-center text-gray-300">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-yellow-500 underline underline-offset-4 hover:text-yellow-400"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </main>
        </HomeLayout>
    );
}

export default Signup;
