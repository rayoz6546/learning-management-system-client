import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import CoursesNavigation from "./Navigation";
import CourseStatus from "./Home/Status";
import PeopleTable from "./People/Table";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/QuizDetails";
import { ViewProvider } from "./Quizzes/View";
import EditorNavigation from "./Quizzes/EditorNavigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizPreviewResults from "./Quizzes/QuizPreviewResults";
import TakeQuiz from "./Quizzes/TakeQuiz";
import QuizResults from "./Quizzes/QuizResults";
import * as coursesClient from "../Courses/client";
import { setQuizzes } from "./Quizzes/quizzesReducer";
import { setResults } from "./Quizzes/resultsReducer";
import * as resultsClient from "./Quizzes/resultsClient";

export default function Courses({ courses }: {
  courses: any[];
}) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const newQuizId = Date.now().toString()
  const dispatch = useDispatch()
  const [setPublished, setNewPublished] = useState(false)
  
  const quiz = quizzes.find((q:any)=>q._id===pathname.split("/")[5])

  // const {questions} = useSelector((state:any)=> state.questionsReducer)
   

  
  
  // const fetchQuizzes = async () => {
  //   const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
  //   dispatch(setQuizzes(quizzes));
  // };

  // useEffect(() => {
  //   fetchQuizzes();


  // }, []);
  
  return (
    <div id="wd-courses">
      <h2 id="wd-course-title" className="text-danger"><FaAlignJustify className="me-4 fs-4 mb-1" />{course && course.name} &gt; {pathname.split("/")[4]} &gt; {(quizzes) && (quiz) && quiz.title}</h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>
        <div className="flex-fill">
          <ViewProvider>
            <Routes>
              <Route path="Home" element={<Home />} />
              <Route path="Modules" element={<Modules />} />
              <Route path="Assignments" element={<Assignments />} />
              <Route path="Assignments/:id" element={<AssignmentEditor />} />
              <Route path="Assignments/new" element={<AssignmentEditor />} />
              <Route path="Quizzes" element={<Quizzes newQuizId={newQuizId} quizzes={quizzes} setPublished={setPublished} setNewPublished={setNewPublished}/>} />
              <Route path="Quizzes/:qid" element={<QuizDetails />} />
              <Route path="Quizzes/:qid/Editor/*" element={<EditorNavigation newQuizId={newQuizId} quizzes={quizzes} setPublished={setPublished} setNewPublished={setNewPublished}/>} />
              <Route path="Quizzes/:qid/Preview/*" element={<QuizPreview/>} />
              <Route path="Quizzes/:qid/PreviewResults" element={<QuizPreviewResults />} />
              <Route path="Quizzes/:qid/TakeQuiz" element={<TakeQuiz />} />
              <Route path="Quizzes/:qid/QuizResults" element={<QuizResults />} />
              <Route path="People" element={<PeopleTable />} />
            </Routes>
          </ViewProvider>
        </div>

        
      </div>
    </div>
  );
}

  