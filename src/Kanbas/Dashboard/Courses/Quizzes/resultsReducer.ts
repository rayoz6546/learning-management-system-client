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



            // Find the previous result for the same user and quizId
            const previousResult = state.results.find(
              (result:any ) => result.userId === userId && result.quizId === quizId
            );
      
            // Calculate the new attempt number based on the previous result
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
        
              // Add the new result (latest attempt) to the filtered results
              state.results = [...updatedResults, newResult];
            },  



            
      

        
    
    }})

export const { addResults, setResults } = resultsSlice.actions;
export default resultsSlice.reducer;