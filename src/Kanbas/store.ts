import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Dashboard/Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Dashboard/Courses/Assignments/reducer";
import enrollmentsReducer from "./Dashboard/Enrollment/reducer";
import coursesReducer from "./Dashboard/Courses/reducer";
import quizzesReducer from "./Dashboard/Courses/Quizzes/quizzesReducer";
import questionsReducer from "./Dashboard/Courses/Quizzes/questionsReducer";
import resultsReducer from "./Dashboard/Courses/Quizzes/resultsReducer";
import filesReducer from "./Dashboard/Courses/filesReducer";
import assignmentsResultsReducer from "./Dashboard/Courses/Assignments/assignmentResultsReducer";
import studentFilesReducer from "./Dashboard/Courses/Assignments/studentFileReducer";
import usersReducer from "./Account/usersReducer";
import announcementsReducer from "./Dashboard/Courses/Announcements/reducer"
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
    filesReducer,
    assignmentsResultsReducer,
    studentFilesReducer,
    usersReducer,
    announcementsReducer,
  },
});
export default store;