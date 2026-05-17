import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  enrollments: [] as any[],
  

};
const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },

    enroll: (state, action) => {
        const newEnrollment: any = {
            _id: action.payload._id,
            user: action.payload.user,
            course: action.payload.course,
          };
          state.enrollments = [...state.enrollments, newEnrollment];
    },

    unenroll: (state, { payload: enrollmentId }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => e._id !== enrollmentId);
    },

    updateEnrollment: (state, { payload: updatedEnrollment }) => {

      state.enrollments = state.enrollments.map((q: any) =>
          q._id === updatedEnrollment._id ? updatedEnrollment : q
      ) as any;
  },
  },
});
export const { enroll, unenroll, setEnrollments, updateEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;