import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lessons: [],
};
const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    setLessons: (state, action) => {
      state.lessons = action.payload;
    },


    addLesson: (state, { payload: {lesson, moduleId} }) => {
      const newLesson: any = {
        _id: new Date().getTime().toString(),
        moduleId: moduleId,
        name: lesson.name,
        url: lesson.url,
      };
      state.lessons = [...state.lessons, newLesson] as any;
    },
    
},
});
export const { setLessons, addLesson} =
lessonsSlice.actions;
export default lessonsSlice.reducer;