import { createSlice } from "@reduxjs/toolkit";
// import { enrollments } from "../../Database";

const initialState = {
  // enrollments: enrollments,
  enrollments: [],
  

};
const enrollSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },

    enroll: (state, action) => {
        const newEnrollment: any = {
            // _id: new Date().getTime().toString(),
            // ...action.payload
            _id: action.payload._id,
            user: action.payload.user,
            course: action.payload.course,
          };
          // state.enrollments = [...state.enrollments, newEnrollment];
    },
    unEnroll:(state, action)=>{
        state.enrollments = state.enrollments.filter(
            (m: any) => !(m.course === action.payload.course && m.user === action.payload.user) );
    }
  },
});
export const { enroll, unEnroll, setEnrollments } = enrollSlice.actions;
export default enrollSlice.reducer;