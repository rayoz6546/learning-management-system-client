import { createSlice } from "@reduxjs/toolkit";
// import { courses } from "../../Database";


const initialState = {
    courses: [],
    // course: courses,
};



const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },

    addNewCourse: (state, action) => {

        // const newCourse: any = {
        //     _id: new Date().getTime().toString(),
        //     ...action.payload
        //   };

        state.courses = [...state.courses, action.payload] as any;
    },
    deleteCourse:(state, action)=>{
        console.log('deleted course: ', action.payload.course)
        state.courses = state.courses.filter((m:any) => m._id !== action.payload.course) as any;
    },


    updateCourse : (state, action)=>{
            state.courses = state.courses.map((m: any) =>
              m._id === action.payload._id ? action.payload : m
            ) as any;
    }
  },
});
export const { addNewCourse, deleteCourse,updateCourse, setCourses } = coursesSlice.actions;
export default coursesSlice.reducer;