import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  mailCheck,
  sendEmail,
  emailVericationCodeCheck,
} from "../apis/memberApis"; // API 호출 Thunk 가져오기

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
      });
  },
});

export default memberSlice.reducer;
