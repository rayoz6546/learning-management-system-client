import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    assignmentResults: [] as any,
};

const assignmentResultsSlice = createSlice({
    name: "assignmentResults",
    initialState,
    reducers: {

        setAssignmentResults: (state, action) => {
            state.assignmentResults = action.payload
        },

        addAssignmentResult: (state, action) => {

            const { _id, courseId,assignmentId, userId, submission_type, submission,submission_date, score, attempt } = action.payload;

         
            const previousResult = state.assignmentResults.find(
              (result:any ) => result.userId === userId && result.assignmentId === assignmentId
            );
      
            
            const newAttempt = previousResult ? previousResult.attempt + 1 : 1;

            const newResult: any = {
                _id: action.payload._id,
                courseId: action.payload.courseId,
                assignmentId: action.payload.assignmentId,
                userId: action.payload.userId,
                submission_type: action.payload.submission_type,
                submission: action.payload.submission,
                submitted_date: action.payload.submission_date,
                score: action.payload.score,
                attempt: newAttempt,
            };
            state.assignmentResults = [...state.assignmentResults, newResult];

            const existingIndex = state.assignmentResults.findIndex(
                (result: any) =>
                    result.userId === newResult.userId && result.assignmentId === newResult.assignmentId
            );
            
            if (existingIndex !== -1) {
                state.assignmentResults[existingIndex] = newResult; // Update existing
            } else {
                state.assignmentResults.push(newResult); // Add new
            }
            

            },  
    updateAssignmentResult: (state, action) => {
        const updatedResult = action.payload;
        const index = state.assignmentResults.findIndex(
            (result: any) => result._id === updatedResult._id
        );
    
        if (index !== -1) {
            // Update existing assignment result
            state.assignmentResults[index] = { ...state.assignmentResults[index], ...updatedResult };
        }
        },
        
    deleteAssignmentResult: (state, { payload: resultId }) => {
        state.assignmentResults = state.assignmentResults.filter((q: any) => q._id !== resultId)
    },

    deleteAllAssignmentResults: (state, { payload: assignmentId }) => {
        state.assignmentResults = state.assignmentResults.filter((q: any) => q.assignmentId !== assignmentId)
    },
    
    }})

export const { addAssignmentResult, setAssignmentResults,deleteAssignmentResult,deleteAllAssignmentResults, updateAssignmentResult } = assignmentResultsSlice.actions;
export default assignmentResultsSlice.reducer;