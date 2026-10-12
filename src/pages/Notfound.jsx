
import { useNavigate } from "react-router-dom";

function Notfound() {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1A2238] px-4 text-center">
            <h1 className="text-8xl font-extrabold text-white sm:text-9xl">
                404
            </h1>

            <p className="mt-4 text-lg text-gray-300">
                Page not found.
            </p>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-8 rounded-md border border-[#FF6A3D] px-8 py-3 text-sm font-medium text-[#FF6A3D] transition hover:bg-[#FF6A3D] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
            >
                Go back
            </button>

            <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="mt-4 text-sm text-gray-300 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
            >
                Go to homepage
            </button>
        </main>
    );
}

export default Notfound;
