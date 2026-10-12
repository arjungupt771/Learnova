
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
    courseList: [],
    isLoading: false,
    isCreating: false,
    error: null,
};

function getErrorPayload(error, fallbackMessage) {
    return {
        status: error?.response?.status,
        message:
            error?.response?.data?.message ||
            error?.message ||
            fallbackMessage,
    };
}

export const getAllCourses = createAsyncThunk(
    "course/getAllCourses",
    async (_, { rejectWithValue }) => {
        try {
            const request = axiosInstance.get("/courses");

            const response = await toast.promise(request, {
                loading: "Loading courses...",
                success: (result) =>
                    result?.data?.message || "Courses loaded successfully",
                error: (error) =>
                    error?.response?.data?.message ||
                    "Failed to load courses",
            });

            const courses = response?.data?.courses;

            if (!Array.isArray(courses)) {
                return rejectWithValue({
                    message: "The server returned an invalid course list.",
                });
            }

            return courses;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to load courses.")
            );
        }
    }
);

export const createNewCourse = createAsyncThunk(
    "course/create",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("createdBy", data.createdBy);
            formData.append("thumbnail", data.thumbnail);

            const request = axiosInstance.post("/courses", formData);

            const response = await toast.promise(request, {
                loading: "Creating course...",
                success: (result) =>
                    result?.data?.message || "Course created successfully",
                error: (error) =>
                    error?.response?.data?.message ||
                    "Failed to create course",
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to create course.")
            );
        }
    }
);

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        clearCourseError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseList = action.payload;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to load courses.";
            })

            .addCase(createNewCourse.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createNewCourse.fulfilled, (state) => {
                state.isCreating = false;
            })
            .addCase(createNewCourse.rejected, (state, action) => {
                state.isCreating = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to create course.";
            });
    },
});

export const { clearCourseError } = courseSlice.actions;

export default courseSlice.reducer;
