
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layouts/HomeLayout";
import { getUserData, updateProfile } from "../../redux/slices/authSlice";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.data);

    const [fullName, setFullName] = useState(userData?.fullName || "");
    const [avatar, setAvatar] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFullName(userData?.fullName || "");
    }, [userData?._id, userData?.fullName]);

    useEffect(() => {
        if (!avatar) {
            setPreviewImage("");
            return undefined;
        }

        const objectUrl = URL.createObjectURL(avatar);
        setPreviewImage(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [avatar]);

    function handleImageUpload(event) {
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
            toast.error("The profile image must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        setAvatar(uploadedImage);
    }

    async function onFormSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const trimmedName = fullName.trim();

        if (!userData?._id) {
            toast.error("Your user details could not be loaded. Please sign in again.");
            return;
        }

        if (trimmedName.length < 5) {
            toast.error("Your name must contain at least 5 characters.");
            return;
        }

        if (trimmedName.length > 100) {
            toast.error("Your name must be 100 characters or fewer.");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", trimmedName);

        if (avatar) {
            formData.append("avatar", avatar);
        }

        setIsSubmitting(true);

        try {
            await dispatch(
                updateProfile([userData._id, formData])
            ).unwrap();

            try {
                await dispatch(getUserData()).unwrap();
            } catch {
                toast.error(
                    "Your profile was updated, but refreshing your user details failed."
                );
            }

            navigate("/user/profile", { replace: true });
        } catch {
            // The update thunk displays the API error notification.
        } finally {
            setIsSubmitting(false);
        }
    }

    const displayedImage =
        previewImage || userData?.avatar?.secure_url || "";

    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10">
                <form
                    onSubmit={onFormSubmit}
                    className="flex w-full max-w-md flex-col gap-5 rounded-lg p-6 text-white shadow-[0_0_10px_black] sm:p-8"
                >
                    <h1 className="text-center text-2xl font-bold">
                        Edit Profile
                    </h1>

                    <div className="flex flex-col items-center gap-3">
                        <label
                            htmlFor="image_uploads"
                            className="cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-yellow-500"
                        >
                            {displayedImage ? (
                                <img
                                    src={displayedImage}
                                    alt="Profile image preview"
                                    className="h-28 w-28 rounded-full border border-gray-600 object-cover"
                                />
                            ) : (
                                <BsPersonCircle
                                    aria-hidden="true"
                                    className="h-28 w-28 text-gray-300"
                                />
                            )}
                        </label>

                        <label
                            htmlFor="image_uploads"
                            className="cursor-pointer text-sm text-yellow-500 hover:text-yellow-400"
                        >
                            Change profile image (optional)
                        </label>

                        <input
                            type="file"
                            onChange={handleImageUpload}
                            id="image_uploads"
                            name="avatar"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                            className="sr-only"
                        />

                        <p className="text-xs text-gray-400">
                            JPG, PNG, WebP, or SVG · Max 5 MB
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            className="font-semibold"
                            htmlFor="fullName"
                        >
                            Full name
                        </label>

                        <input
                            required
                            type="text"
                            id="fullName"
                            name="fullName"
                            maxLength={100}
                            autoComplete="name"
                            placeholder="Enter your full name"
                            value={fullName}
                            className="rounded border border-gray-600 bg-transparent px-3 py-2 outline-none focus:border-yellow-500"
                            onChange={(event) =>
                                setFullName(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-yellow-500 py-3 text-lg font-semibold text-black transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Updating profile..." : "Save Changes"}
                    </button>

                    <Link
                        to="/user/profile"
                        className="text-center text-yellow-500 underline underline-offset-4 hover:text-yellow-400"
                    >
                        Back to profile
                    </Link>
                </form>
            </main>
        </HomeLayout>
    );
}

export default EditProfile;
