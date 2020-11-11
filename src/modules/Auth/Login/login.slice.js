import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "services/axios";
import Router from "next/router";
import Cookies from "js-cookie";

export const login = createAsyncThunk("login", async ({ email, password }, { dispatch }) => {
  try {
    const {
      data: { user, isOtpVerify },
    } = await api.post("/api/auth/login", { email, password });
    if (!isOtpVerify) {
      dispatch(authSuccess(user));
      Router.push("/admin");
    } else {

      // Bat de gui ma otp ve dt 
      // await api.post("/api/auth/send-otp-auth", { email });
      dispatch(needVerifyOtp());
    }
  } catch (err) {
    throw new Error();
  }
});

export const verifyOtp = createAsyncThunk("verifyOtp", async ({ email, otp }, { dispatch }) => {
  //Cai nay dung neu xac nhan bang server nha 
  // const { data } = await api.post("/api/auth/verify-otp-auth", { email, otp });

  // Day la du lieu mau , khong dung trong deploy
  const data = {};
  data.status = "approved";
  //
  if (data.status === "approved") {
    dispatch(authSuccess());
    Router.push("/");
    return;
  }
  dispatch(verifyOtpFail());
});

export const logout = createAsyncThunk("logout", async (data, {dispatch}) => {
  Cookies.remove("payload");
  dispatch(logoutSuccess()) 
});

const logInSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    isOtpVerify: true,

    numberOfVerifyOtpFail: 0,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
    },
    needVerifyOtp: (state) => {
      state.isOtpVerify = true;
    },
    authSuccess: (state, action) => {
      state.isOtpVerify = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    verifyOtpFail: (state) => {
      state.numberOfVerifyOtpFail += 1;
    },
  },
});

export const { setUser, logoutSuccess, needVerifyOtp, authSuccess, verifyOtpFail } = logInSlice.actions;

export default logInSlice.reducer;
