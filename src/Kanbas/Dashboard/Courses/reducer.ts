import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    courses: [] as any[],
};



const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },

    addNewCourse: (state, action) => {

        const newCourse = {
          _id: action.payload._id,
          name: action.payload.name,
          number: action.payload.number,
          credits: action.payload.credits,
          description: action.payload.description,
          size: action.payload.size,
          data: action.payload.data,
      };
        state.courses = [...state.courses, newCourse];
    },

    deleteCourse:(state, { payload: courseId })=>{
        state.courses = state.courses.filter((course:any) => course._id !== courseId);
    },


    updateCourse: (state, { payload: course }) => {
      state.courses = state.courses.map((c: any) =>
        c._id === course._id ? course : c
      ) as any;
  }
}
  
});
export const { addNewCourse, deleteCourse,updateCourse, setCourses } = coursesSlice.actions;
export default coursesSlice.reducer;