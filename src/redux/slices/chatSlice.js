import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    refetch: false,
  },
  reducers: {
    getUsersListSuccess: (state, action) => {
      state.users = action.payload;
    },
    refetch: (state, action) => {
      state.refetch = action.payload;
    },
  },
});

export const { getUsersListSuccess, refetch } = chatSlice.actions;

export const getUsersList = () => async (dispatch) => {
  try {
    const url = `${BASE_URL}/user/list/v1`;

    const { data } = await axios.get(url, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    dispatch(getUsersListSuccess(data.data));
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 3000,
    });
  }
};

export default chatSlice.reducer;
