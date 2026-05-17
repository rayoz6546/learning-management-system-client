import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  announcements: [] as any,
};
const announcementsSlice = createSlice({
    name: "announcements",
    initialState,
    reducers: {

        setAnnouncements: (state, action) => {
            state.announcements = action.payload;
          },

          
        addAnnouncement: (state, {payload: announcement}) => {
            const newAnnouncement: any = {
                _id: new Date().getTime().toString(),
                courseId: announcement.courseId,
                title:announcement.title,
                body: announcement.body,
                date: announcement.date,
                author: announcement.author,

            };
            state.announcements = [...state.announcements, newAnnouncement];
        },

        deleteAnnouncement: (state, {payload: announcementId}) => {
            state.announcements = state.announcements.filter(
                (m: any) => m._id !== announcementId);
        },

        updateAnnouncement: (state, { payload: announcement }) => {
            state.announcements = state.announcements.map((m: any) =>
                m._id === announcement._id ? announcement : m
            ) as any;
            },

}
});

export const { addAnnouncement, deleteAnnouncement, updateAnnouncement,  setAnnouncements} =
announcementsSlice.actions;
export default announcementsSlice.reducer;