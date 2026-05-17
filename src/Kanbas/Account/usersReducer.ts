import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [] as any[],
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
 
            state.users = action.payload;
        },
        addUser: (state, action) => {

            const newUser = {
                _id: action.payload._id,
                universityId: action.payload.universityId,
                password: action.payload.password,
                username: action.payload.username,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
                dob: action.payload.dob,
                role: action.payload.role,
                lastActivity: action.payload.lastActivity,
                totalActivity: action.payload.totalActivity,
            };

            state.users = [...state.users, newUser];
        },
        deleteUser: (state, { payload: userId }) => {

            state.users = state.users.filter((user: any) => user._id !== userId);
        },
  
        updateUser: (state, { payload: user }) => {
            state.users = state.users.map((m: any) =>
                m._id === user._id ? user : m
            ) as any;
            },

    },
});

export const { setUsers, addUser, deleteUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
