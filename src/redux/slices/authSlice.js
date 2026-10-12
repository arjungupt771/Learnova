
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const AUTH_STORAGE_KEYS = ["data", "isLoggedIn", "role"];

function getErrorPayload(error, fallbackMessage) {
    return {
        ...(error?.response?.data || {}),
        status: error?.response?.status,
        message:
            error?.response?.data?.message ||
            error?.message ||
            fallbackMessage,
    };
}

function extractUser(responseData) {
    const candidates = [
        responseData?.user,
        responseData?.data?.user,
        responseData?.data?.data?.user,
        responseData?.data,
    ];

    return (
        candidates.find(
            (candidate) =>
                candidate &&
                typeof candidate === "object" &&
                !Array.isArray(candidate) &&
                typeof candidate.role === "string" &&
                candidate.role.length > 0
        ) || null
    );
}

function readStoredUser() {
    try {
        const storedData = localStorage.getItem("data");

        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);

        if (!parsedData || typeof parsedData !== "object") {
            return null;
        }

        const user = parsedData.user || parsedData;

        if (
            typeof user.role !== "string" ||
            user.role.length === 0
        ) {
            return null;
        }

        return user;
    } catch {
        return null;
    }
}

function getStoredAuthState() {
    try {
        const user = readStoredUser();
        const isLoggedIn =
            localStorage.getItem("isLoggedIn") === "true";

        if (!isLoggedIn || !user) {
            return {
                isLoggedIn: false,
                role: "",
                data: {},
            };
        }

        return {
            isLoggedIn: true,
            role: user.role,
            data: user,
        };
    } catch {
        return {
            isLoggedIn: false,
            role: "",
            data: {},
        };
    }
}

function persistUser(user) {
    if (
        !user ||
        typeof user !== "object" ||
        typeof user.role !== "string" ||
        user.role.length === 0
    ) {
        return false;
    }

    try {
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user.role);
        return true;
    } catch {
        return false;
    }
}

function clearAuthStorage() {
    try {
        AUTH_STORAGE_KEYS.forEach((key) => {
            localStorage.removeItem(key);
        });
    } catch {
        // Storage may be unavailable in restricted browser environments.
    }
}

function getToastError(error, fallbackMessage) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage
    );
}

const initialState = getStoredAuthState();

export const createAccount = createAsyncThunk(
    "auth/signup",
    async (data, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/user/register", data),
                {
                    loading: "Creating your account...",
                    success: (result) =>
                        result?.data?.message ||
                        "Account created successfully",
                    error: (error) =>
                        getToastError(
                            error,
                            "Failed to create your account"
                        ),
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to create your account")
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (data, { rejectWithValue }) => {
        try {
            const [userId, formData] = data;

            const response = await toast.promise(
                axiosInstance.put(`/user/update/${userId}`, formData),
                {
                    loading: "Updating your account...",
                    success: (result) =>
                        result?.data?.message ||
                        "Profile updated successfully",
                    error: (error) =>
                        getToastError(
                            error,
                            "Failed to update your account"
                        ),
                }
            );

            const user = extractUser(response.data);

            if (user) {
                persistUser(user);
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to update your account")
            );
        }
    }
);

export const getUserData = createAsyncThunk(
    "auth/getData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/me");
            const user = extractUser(response.data);

            if (!user) {
                return rejectWithValue({
                    message:
                        "The server response did not contain valid user information.",
                });
            }

            if (!persistUser(user)) {
                return rejectWithValue({
                    message:
                        "Unable to save the current session in browser storage.",
                });
            }

            return { user };
        } catch (error) {
            if (error?.response?.status === 401) {
                clearAuthStorage();
            }

            return rejectWithValue(
                getErrorPayload(error, "Failed to fetch user data")
            );
        }
    }
);

export const login = createAsyncThunk(
    "auth/signin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/user/login", data),
                {
                    loading: "Authenticating your account...",
                    success: (result) =>
                        result?.data?.message || "Login successful",
                    error: (error) =>
                        getToastError(
                            error,
                            "Failed to authenticate your account"
                        ),
                }
            );

            const user = extractUser(response.data);

            if (!user) {
                clearAuthStorage();

                return rejectWithValue({
                    message:
                        "Login response did not contain valid user information.",
                });
            }

            if (!persistUser(user)) {
                clearAuthStorage();

                return rejectWithValue({
                    message:
                        "Unable to save your login session in browser storage.",
                });
            }

            return { user };
        } catch (error) {
            clearAuthStorage();

            return rejectWithValue(
                getErrorPayload(
                    error,
                    "Failed to authenticate your account"
                )
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await toast.promise(
                axiosInstance.post("/user/logout"),
                {
                    loading: "Logging out...",
                    success: (result) =>
                        result?.data?.message || "Logged out successfully",
                    error: (error) =>
                        getToastError(error, "Failed to log out"),
                }
            );

            clearAuthStorage();

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to log out")
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.data = action.payload.user;
            })
            .addCase(login.rejected, (state) => {
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })

            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })

            .addCase(getUserData.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                state.data = action.payload.user;
            })
            .addCase(getUserData.rejected, (state, action) => {
                if (action.payload?.status === 401) {
                    state.isLoggedIn = false;
                    state.role = "";
                    state.data = {};
                }
            })

            .addCase(updateProfile.fulfilled, (state, action) => {
                const user = extractUser(action.payload);

                if (user) {
                    state.data = user;
                    state.role = user.role;
                    state.isLoggedIn = true;
                }
            });
    },
});

export default authSlice.reducer;
