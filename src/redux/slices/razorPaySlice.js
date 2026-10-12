
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: [],
    isLoading: false,
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

export const getRazorPayId = createAsyncThunk(
    "razorpay/getId",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/payments/razorpay-key"
            );

            if (!response.data?.key) {
                return rejectWithValue({
                    message: "The payment provider did not return a key.",
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to load the payment key.")
            );
        }
    }
);

export const purchaseCourseBundle = createAsyncThunk(
    "razorpay/purchaseCourseBundle",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/payments/subscribe");

            if (!response.data?.subscription_id) {
                return rejectWithValue({
                    message:
                        "The server did not return a valid subscription ID.",
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to create a subscription.")
            );
        }
    }
);

export const verifyUserPayment = createAsyncThunk(
    "razorpay/verifyPayment",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/payments/verify", {
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_subscription_id: data.razorpay_subscription_id,
                razorpay_signature: data.razorpay_signature,
            });

            const result = response.data;
            const success = result?.success ?? result?.sucess;

            if (success !== true) {
                return rejectWithValue({
                    ...result,
                    message:
                        result?.message ||
                        "The server did not confirm successful payment verification.",
                });
            }

            return {
                ...result,
                success: true,
            };
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Payment verification failed.")
            );
        }
    }
);

export const getPaymentRecord = createAsyncThunk(
    "razorpay/getPaymentRecord",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/payments?count=100");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to retrieve payment records.")
            );
        }
    }
);

export const cancelCourseBundle = createAsyncThunk(
    "razorpay/cancelCourseBundle",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/payments/unsubscribe");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                getErrorPayload(error, "Failed to cancel the subscription.")
            );
        }
    }
);

const razorPaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {
        resetPaymentVerification(state) {
            state.isPaymentVerified = false;
        },
        clearPaymentError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.pending, (state) => {
                state.error = null;
            })
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                state.key = action.payload.key;
            })
            .addCase(getRazorPayId.rejected, (state, action) => {
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to load the payment key.";
            })

            .addCase(purchaseCourseBundle.pending, (state) => {
                state.error = null;
                state.subscription_id = "";
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                state.subscription_id = action.payload.subscription_id;
            })
            .addCase(purchaseCourseBundle.rejected, (state, action) => {
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to create a subscription.";
            })

            .addCase(verifyUserPayment.pending, (state) => {
                state.isLoading = true;
                state.isPaymentVerified = false;
                state.error = null;
            })
            .addCase(verifyUserPayment.fulfilled, (state) => {
                state.isLoading = false;
                state.isPaymentVerified = true;
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isPaymentVerified = false;
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Payment verification failed.";
            })

            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.allPayments = action.payload?.allPayments ?? {};
                state.finalMonths = action.payload?.finalMonths ?? {};
                state.monthlySalesRecord =
                    action.payload?.monthlySalesRecord ?? [];
            })
            .addCase(getPaymentRecord.rejected, (state, action) => {
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to retrieve payment records.";
            })

            .addCase(cancelCourseBundle.rejected, (state, action) => {
                state.error =
                    action.payload?.message ||
                    action.error?.message ||
                    "Failed to cancel the subscription.";
            });
    },
});

export const { resetPaymentVerification, clearPaymentError } =
    razorPaySlice.actions;

export default razorPaySlice.reducer;
