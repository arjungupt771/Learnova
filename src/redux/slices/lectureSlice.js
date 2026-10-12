
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
    lectures: [],
    isLoading: false,
    isAdding: false,
    isDeleting: false,
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

export const getCourseLecture = createAsyncThunk(
    "/course/lecture/get",
    async (cid, { rejectWithValue }) => {
        try {
            const request = axiosInstance.get(`/courses/${cid}`);

            const response = await toast.promise(request, {
                loading: "Fetching course lectures...",
                success: "Course lectures loaded",
                error: (error) =>
                    error?.response?.data?.message ||
                    "Failed to load lectures",
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to load lectures.")
            );
        }
    }
);

export const deleteCourseLecture = createAsyncThunk(
    "/course/lecture/delete",
    async ({ courseId, lectureId }, { rejectWithValue }) => {
        try {
            const request = axiosInstance.delete(
                `/courses?courseId=${encodeURIComponent(courseId)}&lectureId=${encodeURIComponent(lectureId)}`
            );

            const response = await toast.promise(request, {
                loading: "Deleting lecture...",
                success: (result) =>
                    result?.data?.message || "Lecture deleted successfully",
                error: (error) =>
                    error?.response?.data?.message ||
                    "Failed to delete lecture",
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to delete lecture.")
            );
        }
    }
);

export const addCourseLecture = createAsyncThunk(
    "/course/lecture/add",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("lecture", data.lecture);
            formData.append("title", data.title);
            formData.append("description", data.description);

            const request = axiosInstance.post(
                `/courses/${data.id}`,
                formData
            );

            const response = await toast.promise(request, {
                loading: "Adding lecture...",
                success: (result) =>
                    result?.data?.message || "Lecture added successfully",
                error: (error) =>
                    error?.response?.data?.message ||
                    "Failed to add lecture",
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to add lecture.")
            );
        }
    }
);

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {
        clearLectureError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCourseLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCourseLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lectures = Array.isArray(action.payload?.lectures)
                    ? action.payload.lectures
                    : [];
            })
            .addCase(getCourseLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to load lectures.";
            })

            .addCase(addCourseLecture.pending, (state) => {
                state.isAdding = true;
                state.error = null;
            })
            .addCase(addCourseLecture.fulfilled, (state, action) => {
                state.isAdding = false;

                const updatedLectures = action.payload?.course?.lectures;

                if (Array.isArray(updatedLectures)) {
                    state.lectures = updatedLectures;
                }
            })
            .addCase(addCourseLecture.rejected, (state, action) => {
                state.isAdding = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to add lecture.";
            })

            .addCase(deleteCourseLecture.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deleteCourseLecture.fulfilled, (state) => {
                state.isDeleting = false;
            })
            .addCase(deleteCourseLecture.rejected, (state, action) => {
                state.isDeleting = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to delete lecture.";
            });
    },
});

export const { clearLectureError } = lectureSlice.actions;

export default lectureSlice.reducer;
