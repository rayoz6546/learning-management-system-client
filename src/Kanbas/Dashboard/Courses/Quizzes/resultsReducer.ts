import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    results: [] as any,
};

const resultsSlice = createSlice({
    name: "results",
    initialState,
    reducers: {

        setResults: (state, action) => {
            state.results = action.payload
        },

        addResults: (state, action) => {

            const { _id, quizId, courseId, userId, score, answers, timetaken } = action.payload;



         
            const previousResult = state.results.find(
              (result:any ) => result.userId === userId && result.quizId === quizId
            );
      
            
            const newAttempt = previousResult ? previousResult.attempt + 1 : 1;

            const newResult: any = {
                _id: action.payload._id,
                quizId:action.payload.quizId,
                courseId: action.payload.courseId,
                userId: action.payload.userId,
                score: action.payload.score,
                answers: action.payload.answers,
                timetaken: action.payload.timetaken,
                attempt: newAttempt,
            };
            state.results = [...state.results, newResult];


            const updatedResults = state.results.filter(
                (result:any) =>
                  !(result.userId === newResult.userId && result.quizId === newResult.quizId)
              );
        

              state.results = [...updatedResults, newResult];
            },  

        updateResults: (state, action) => {
            const updatedResult = action.payload;
        
            const index = state.results.findIndex(
                (result: any) => result._id === updatedResult._id
            );
        
            if (index !== -1) {
                // Update the existing result
                state.results[index] = { ...state.results[index], ...updatedResult };
            }
            },


            
      

        
    
    }})

export const { addResults, setResults,updateResults } = resultsSlice.actions;
export default resultsSlice.reducer;