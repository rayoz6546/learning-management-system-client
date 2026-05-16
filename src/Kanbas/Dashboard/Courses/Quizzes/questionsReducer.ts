import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    questions: [] as any,
    previousQuestions: [] as any,
};

const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {

        setQuestions: (state, action) => {
            state.previousQuestions = [...state.questions]; 
            state.questions = action.payload;

        },
        // setQuestions: (state, action) => {
        //     const newQuestions = action.payload;
        //     const existingQuestions = state.questions.filter(
        //         (q:any) => !newQuestions.some((newQ:any) => newQ._id === q._id)
        //     );
        //     state.questions = [...existingQuestions, ...newQuestions];
        // },

        addQuestion: (state, action) => {
            const newQuestion: any = {
                _id: action.payload._id,
                quizId:action.payload.quizId,
                courseId: action.payload.courseId,
                title: action.payload.title,
                type: action.payload.type,
                points: action.payload.points,
                description: action.payload.description,
                answers: action.payload.answers,
                correct_answer: action.payload.correct_answer,
            };
            state.questions = [...state.questions, newQuestion];
            
        },
  

        deleteQuestion: (state, {payload:  questionId }) => {

            if (questionId) {

            state.questions = state.questions.filter((q: any) => q._id !== questionId)}},

        deleteAllQuestions: (state, {payload: quizId}) => {

            if (quizId) {
                state.questions = state.questions.filter((q:any) => q.quizId !== quizId)
            }

        },


        updateQuestion: (state, action) => {

            const updatedQuestion = action.payload; 

            state.questions = state.questions.map((q: any) =>
                q._id === updatedQuestion._id ? updatedQuestion : q
               
            );
        
        },

        editQuestion: (state, { payload: { questionId } }) => {
            if (questionId){
            state.questions = state.questions.map((q: any) =>
                q._id === questionId ? { ...q, editing: true } : q
            ) as any;}
        },
    


        resetQuestions: (state) => {
            state.questions = [...state.previousQuestions];
        }
    }
});

export const { setQuestions, addQuestion, deleteQuestion, deleteAllQuestions, updateQuestion, editQuestion, resetQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;