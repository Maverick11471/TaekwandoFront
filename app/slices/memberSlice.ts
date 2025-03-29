import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mailCheck } from "../apis/memberApis"; // API 호출 Thunk 가져오기

interface MemberState {
  email: string;
}

const initialState: MemberState = {
  email: "",
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(mailCheck.fulfilled, (state, action) => {
        console.log("이메일 중복확인 Cors 연결");

        return action.payload.item;
      })
      .addCase(mailCheck.rejected, (state, action) => {
        console.log("이메일 중복확인 Cors 연결불가능", action.error);
        alert("에러가 발생했습니다.");
        return state;
      });
  },
});

export default memberSlice.reducer;
