import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface MemberData {
  email?: string;
  emailVerificationCode?: string;
  enteredCode?: string;
}

export const mailCheck = createAsyncThunk(
  "member/email-check",
  async (member: MemberData, thunkApi) => {
    try {
      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_BACK_SERVER}/api/email-check`,
        `http://localhost:8080/members/emails/email-duplicate-check`,
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

export const sendEmail = createAsyncThunk(
  "member/sendEmail",

  async (member: MemberData, thunkApi) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/members/emails/send-email`,
        member
      );

      return response.data.item;
    } catch (e) {
      console.log("오류 발생");
      return thunkApi.rejectWithValue("Send Mail Fail");
    }
  }
);

export const emailVericationCodeCheck = createAsyncThunk(
  "member/emailVericationCodeCheck",

  async (member: MemberData, thunkApi) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/members/emails/email-verification-code-check`,
        member
      );

      return response.data;
    } catch (e) {
      console.log("인증번호 오류 발생");
      return thunkApi.rejectWithValue("Not Verification Code");
    }
  }
);

export const join = createAsyncThunk(
  "member/join",

  async (member: MemberData, thunkApi) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/members/join`,
        member
      );

      return response.data.item;
    } catch (e) {
      console.log("회원가입 오류 발생");
      return thunkApi.rejectWithValue("join error");
    }
  }
);
