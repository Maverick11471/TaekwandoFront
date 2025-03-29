import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { error } from "console";

interface MemberData {
  email: string;
}

export const mailCheck = createAsyncThunk(
  "api/email-check",
  async (member: MemberData, thunkApi) => {
    try {
      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_BACK_SERVER}/api/email-check`,
        `http://localhost:8080/api/email-check`,
        member
      );
      console.log("연결완료");
      return response.data.item;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return thunkApi.rejectWithValue(e.response?.data?.message || e.message);
      }
      return thunkApi.rejectWithValue("Unknown error occurred");
    }
  }
);
