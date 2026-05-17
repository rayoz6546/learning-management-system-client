import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentFiles: [] as any[],
};

const studentFilesSlice = createSlice({
    name: "studentFiles",
    initialState,
    reducers: {
        setStudentFiles: (state, action) => {
            // if (!Array.isArray(action.payload)) {
            //     console.error("Invalid payload for setFiles:", action.payload);
            //     return;
            // }


            state.studentFiles = action.payload;
        },
        addStudentFile: (state, action) => {
            // if (!Array.isArray(state.studentFiles)) {
            //     console.error("State.files is not an array. Resetting to an empty array.");
            //     state.studentFiles = [];
            // }
            
            const newFile = {
                _id: action.payload._id,
                itemId: action.payload.itemId,
                userId: action.payload.userId,
                originalName: action.payload.originalName,
                mimeType: action.payload.mimeType,
                size: action.payload.size,
                data: action.payload.data,
            };

            state.studentFiles= [...state.studentFiles, newFile];
        },
        deleteStudentFile: (state, { payload: fileId }) => {
            // if (!Array.isArray(state.studentFiles)) {
            //     console.error("State.files is not an array:", state.studentFiles);
            //     return;
            // }
            state.studentFiles = state.studentFiles.filter((file: any) => file._id !== fileId);
        },
    },
});

export const { setStudentFiles, addStudentFile, deleteStudentFile } = studentFilesSlice.actions;
export default studentFilesSlice.reducer;
