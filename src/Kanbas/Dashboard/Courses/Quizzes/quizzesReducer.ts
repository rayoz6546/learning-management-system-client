import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    quizzes: [] as any,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {

        setQuizzes(state, action) {
            state.quizzes = action.payload;
        },

        addQuiz: (state, action) => {
            const newQuiz: any = {
                _id: action.payload._id,
                title: action.payload.title,
                course: action.payload.course,
                availability: action.payload.availability,
                available_from: action.payload.available_from,
                available_until: action.payload.available_until,
                due_date: action.payload.due_date,
                points: action.payload.points,
                number_questions: action.payload.number_questions,
                score: action.payload.score,
                quiz_type: action.payload.quiz_type,
                assignment_group: action.payload.assignment_group,
                shuffle_answers: action.payload.shuffle_answers,
                time_limit: action.payload.time_limit,
                multiple_attempts: action.payload.multiple_attempts,
                number_attempts: action.payload.number_attempts,
                show_correct_answers: action.payload.show_correct_answers,
                access_code: action.payload.access_code,
                one_question_at_a_time: action.payload.one_question_at_a_time,
                webcam_required: action.payload.webcam_required,
                lock_questions_after_answering: action.payload.lock_questions_after_answering,
                description: action.payload.description,
                published: action.payload.published,
                questions: action.payload.questions,
            };
            state.quizzes = [...state.quizzes, newQuiz];

        },
        deleteQuiz: (state, { payload: quizId }) => {
            
            state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId)

        },

        updateQuiz: (state, { payload: updatedQuiz }) => {

            state.quizzes = state.quizzes.map((q: any) =>
                q._id === updatedQuiz._id ? updatedQuiz : q
            ) as any;
        },
        editQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quizId ? { ...q, editing: true } : q
            ) as any;
        },

        publishQuiz: (state, { payload: { quizId, courseId } }) => {
            // const quiz = state.quizzes.find((q:any) => q._id === quizId && q.course === courseId);
            // if (quiz) {
            //     quiz.published = true;
            // }
            state.quizzes = state.quizzes.map((quiz:any) => 
                quiz._id === quizId && quiz.course === courseId ? { ...quiz, published: true } : quiz
              );
        },
        unpublishQuiz: (state, { payload: { quizId, courseId } }) => {
            // const quiz = state.quizzes.filter((q:any) => q._id === quizId && q.course === courseId);
 
            // if (quiz) {
            //     quiz.published = false;
            // }
            state.quizzes = state.quizzes.map((quiz:any) => 
                quiz._id === quizId && quiz.course === courseId ? { ...quiz, published: false } : quiz
              );
        }
    }
});

export const { addQuiz, deleteQuiz, updateQuiz, editQuiz, publishQuiz, unpublishQuiz, setQuizzes} = quizzesSlice.actions;
export default quizzesSlice.reducer;



