import { createSlice } from "@reduxjs/toolkit";
// import { assignments} from "../../../Database";

const initialState = {
  assignments: [] as any,
};
const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {

        setAssignments: (state, action) => {
            state.assignments = action.payload;
          },

          
        addAssignment: (state, {payload: assignment}) => {
            const newAssignment: any = {
                _id: new Date().getTime().toString(),
                title: assignment.title,
                course: assignment.course,
                points: assignment.points,
                due_date: assignment.due_date,
                available_from: assignment.available_from,
                until: assignment.until,
                description: assignment.description,
                published: assignment.published,
                file: assignment.file,
                attempts: assignment.attempts,
                percentage: assignment.percentage,


            };
            state.assignments = [...state.assignments, newAssignment];
        },

        deleteAssignment: (state, {payload: assignmentId}) => {
            state.assignments = state.assignments.filter(
                (m: any) => m._id !== assignmentId);
        },

        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map((m: any) =>
                m._id === assignment._id ? assignment : m
            ) as any;
            },

            editAssignment: (state, { payload: assignmentId }) => {
                state.assignments = state.assignments.map((m: any) =>
                  m._id === assignmentId ? { ...m, editing: true } : m
              ) as any;
    },
}
});

export const { addAssignment, deleteAssignment, updateAssignment, editAssignment , setAssignments} =
assignmentsSlice.actions;
export default assignmentsSlice.reducer;