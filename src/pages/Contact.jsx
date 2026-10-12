import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../config/axiosInstance";
import { isEmail } from "../helpers/regexMatcher";
import HomeLayout from "../layouts/HomeLayout";

const INITIAL_FORM = {
    name: "",
    email: "",
    message: "",
};

function Contact() {
    const [userInput, setUserInput] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setUserInput((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function onFormSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const name = userInput.name.trim();
        const email = userInput.email.trim();
        const message = userInput.message.trim();

        if (!name || !email || !message) {
            toast.error("All fields are mandatory.");
            return;
        }

        if (!isEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                axiosInstance.post("/contact", { name, email, message }),
                {
                    loading: "Submitting your query...",
                    success: "Your message was submitted successfully.",
                    error: (error) =>
                        error?.response?.data?.message ||
                        "Failed to submit your message. Please try again.",
                }
            );

            setUserInput({ ...INITIAL_FORM });
        } catch {
            // toast.promise displays the request error.
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <HomeLayout>
            <main className="flex min-h-[90vh] items-center justify-center px-4 py-10">
                <form
                    onSubmit={onFormSubmit}
                    noValidate
                    className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-md p-5 text-white"
                >
                    <h1 className="text-3xl font-semibold">Contact us</h1>

                    <div className="flex w-full flex-col gap-1">
                        <label htmlFor="name" className="font-semibold">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={100}
                            required
                            placeholder="Enter your name"
                            className="rounded-sm border bg-white px-3 py-2 text-black"
                            value={userInput.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            maxLength={254}
                            required
                            placeholder="Enter your email"
                            className="rounded-sm border bg-white px-3 py-2 text-black"
                            value={userInput.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <label htmlFor="message" className="font-semibold">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            maxLength={5000}
                            rows={6}
                            placeholder="Enter your message"
                            className="resize-y rounded-sm border bg-white px-3 py-2 text-black"
                            value={userInput.message}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-sm bg-yellow-400 py-3 text-lg font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </main>
        </HomeLayout>
    );
}

export default Contact;
