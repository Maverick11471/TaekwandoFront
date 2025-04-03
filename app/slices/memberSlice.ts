import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  mailCheck,
  sendEmail,
  emailVericationCodeCheck,
  join,
  login,
  findPassword,
  updatePassword,
} from "../apis/memberApis";

interface MemberState {
  email: string;
  emailVerificationCode: string;
}

const initialState: MemberState = {
  email: "",
  emailVerificationCode: "",
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(mailCheck.fulfilled, (state, action) => {
        return action.payload.item;
      })
      .addCase(mailCheck.rejected, (state, action) => {
        console.log("이메일 중복확인 Cors 연결불가능", action.error);
        alert("에러가 발생했습니다.");
        return state;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        return action.payload.item;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        console.log("이메일 인증번호 전송 불가능", action.error);
        alert("에러가 발생했습니다.");
        return state;
      })
      .addCase(emailVericationCodeCheck.fulfilled, (state, action) => {
        console.log("인증코드답변:" + action.payload);
        return action.payload;
      })
      .addCase(emailVericationCodeCheck.rejected, (state, action) => {
        console.log("인증번호 오류", action.error);
        alert("에러가 발생했습니다.");
        return state;
      })
      .addCase(join.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(join.rejected, (state, action) => {
        alert("에러가 발생했습니다.");
        return state;
      })
      .addCase(login.fulfilled, (state, action) => {
        return action.payload.item;
      })
      .addCase(login.rejected, (state, action) => {
        return state;
      })
      .addCase(findPassword.fulfilled, (state, action) => {
        return action.payload.item;
      })
      .addCase(findPassword.rejected, (state, action) => {
        return state;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        return action.payload.item;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        return state;
      });
  },
});

export default memberSlice.reducer;
