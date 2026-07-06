import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post(`/login`, {
                email: user.email,
                password: user.password
            });

            if(response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token not provided"
                });
            }

            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {

        try {

            const request = await clientServer.post("/register",{
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,

            })
            
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
        
    }
)


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post(
                "/get_user_and_profile",
            {
                token: user.token
            }
         );

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI) => {
        try{

            const response = await clientServer.get("/user/get_all_users")

            return thunkAPI.fulfillWithValue(response.data)

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionsRequest",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/getConnectionRequests",
        {
          token: data.token,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: data.token,
          connectionId: data.connectionId,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);