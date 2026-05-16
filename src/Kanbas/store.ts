import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Dashboard/Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Dashboard/Courses/Assignments/reducer";
import enrollmentsReducer from "./Dashboard/Enrollment/reducer";
import coursesReducer from "./Dashboard/Courses/reducer";
import quizzesReducer from "./Dashboard/Courses/Quizzes/quizzesReducer";
import questionsReducer from "./Dashboard/Courses/Quizzes/questionsReducer";
import resultsReducer from "./Dashboard/Courses/Quizzes/resultsReducer";

const store = configureStore({

  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
    coursesReducer,
    quizzesReducer,
    questionsReducer,
    resultsReducer,
  },
});
export default store;