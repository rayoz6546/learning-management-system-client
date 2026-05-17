import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    files: [] as any[],
};

const filesSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        setFiles: (state, action) => {
            if (!Array.isArray(action.payload)) {
                console.error("Invalid payload for setFiles:", action.payload);
                return;
            }
            state.files = action.payload;
        },
        addFile: (state, action) => {
            if (!Array.isArray(state.files)) {
                console.error("State.files is not an array. Resetting to an empty array.");
                state.files = [];
            }
            
            const newFile = {
                _id: action.payload._id,
                itemId: action.payload.itemId,
                originalName: action.payload.originalName,
                mimeType: action.payload.mimeType,
                size: action.payload.size,
                data: action.payload.data,
            };

            state.files = [...state.files, newFile];
        },
        deleteFile: (state, { payload: fileId }) => {
            if (!Array.isArray(state.files)) {
                console.error("State.files is not an array:", state.files);
                return;
            }
            state.files = state.files.filter((file: any) => file._id !== fileId);
        },

        updateFile: (state, { payload: file }) => {
            state.files = state.files.map((f: any) =>
              f._id === file._id ? file : f
            ) as any;
          },
    },
});

export const { setFiles, addFile, deleteFile,  updateFile } = filesSlice.actions;
export default filesSlice.reducer;
