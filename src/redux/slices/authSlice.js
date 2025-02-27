import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    refetch: false,
  },
  reducers: {
    getLoginSuccess: (state, action) => {
      state.user = action.payload.data;
      localStorage.setItem("token", action.payload.token);
    },
    refetch: (state, action) => {
      state.refetch = action.payload;
    },
  },
});

export const { getLoginSuccess, refetch } = authSlice.actions;

export const loginUser = (formData, navigate) => async (dispatch) => {
  try {
    const url = `${BASE_URL}/auth/login/v1`;

    const { data } = await axios.post(url, formData);

    toast.success("Login Successfully", {
      position: "top-center",
      autoClose: 3000,
    });

    dispatch(getLoginSuccess(data));
    navigate("/chat-screen");
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 3000,
    });
  }
};

export const checkUserExist = (mobileNumber) => async (dispatch) => {
  try {
    const url = `${BASE_URL}/auth/user/v1?mobileNumber=${mobileNumber}`;

    const { data } = await axios.get(url);
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 3000,
    });
  }
};

export const registerUser = (formData, navigate) => async (dispatch) => {
  try {
    const url = `${BASE_URL}/auth/register/v1`;

    const { data } = await axios.post(url, formData);

    toast.success("Register Successfully", {
      position: "top-center",
      autoClose: 3000,
    });

    dispatch(getLoginSuccess(data));
    navigate("/chat-screen");
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 3000,
    });
  }
};

export default authSlice.reducer;
