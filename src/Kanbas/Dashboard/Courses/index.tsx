import Modules from "./Modules";
import Home from "./Home";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import CoursesNavigation from "./Navigation";
import CourseStatus from "./Home/Status";
import PeopleTable from "./People";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/QuizDetails";
import { useViewContext, ViewProvider } from "./Quizzes/View";
import EditorNavigation from "./Quizzes/EditorNavigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizPreviewResults from "./Quizzes/QuizPreviewResults";
import TakeQuiz from "./Quizzes/TakeQuiz";
import QuizResults from "./Quizzes/QuizResults";
import { setQuizzes } from "./Quizzes/quizzesReducer";
import { setResults } from "./Quizzes/resultsReducer";
import * as resultsClient from "./Quizzes/resultsClient";
import Grades from "./Grades";
import ModulesControls from "./Modules/ModulesControls";
import ProtectedContent from "../../Account/ProtectedContent";
import StudentViewButton from "./Quizzes/StudentViewButton";
import TakeAssignment from "./Assignments/TakeAssignment";
import GradeStudent from "./Grades/GradeStudent";
import StudentQuizResults from "./Grades/studentQuizResults";
import Analytics from "./Analytics";
import { setCourses } from "./reducer";
import * as courseClient from "../Courses/client";
import Announcements from "./Announcements";
import AnnouncementEditor from "./Announcements/editor";
export default function Courses() {
  const { cid } = useParams();
  const {courses} = useSelector((state: any) => state.coursesReducer);
  const course = courses.find((course:any) => course._id === cid);

  const fetchAllCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses()    
      dispatch(setCourses(allCourses));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCourses();

  }, []);

  const { pathname } = useLocation();
  
  const {quizzes} = useSelector((state: any) => state.quizzesReducer);
  const {assignments} = useSelector((state: any) => state.assignmentsReducer);
  const assignment = assignments.find((a:any)=>a._id===pathname.split("/")[5])
  const newQuizId = Date.now().toString()
  const dispatch = useDispatch()
  const {modules} = useSelector((state: any) => state.modulesReducer);

  const lessons = modules.reduce((allLessons: any[], module: any) => {
    return [...allLessons, ...module.lessons];
  }, []);
  
  const quiz = quizzes.find((q:any)=>q._id===pathname.split("/")[5])

  const [allIconsVisible, setAllIconsVisible] = useState(false);
  const [visibleIcons, setVisibleIcons] = useState<Record<string, boolean>>({});

  const toggleAllIcons = () => {
    const allCurrentlyVisible = modules.every((module: any) => visibleIcons[module._id]) &&
                                lessons.every((lesson: any) => visibleIcons[lesson._id]);
  
    const newVisibility = {
      ...modules.reduce((acc: any, module: any) => {
        acc[module._id] = !allCurrentlyVisible; // Toggle visibility for modules
        return acc;
      }, {}),
      ...lessons.reduce((acc: any, lesson: any) => {
        acc[lesson._id] = !allCurrentlyVisible; // Toggle visibility for lessons
        return acc;
      }, {}),
    };
  
    setVisibleIcons(newVisibility);
  };
  

const toggleIcons = (Id: string) => {
    setVisibleIcons((prev) => ({
        ...prev,
        [Id]: !prev[Id],
    }));
};
 
  
  
  const [collapsed, setCollapsed] = useState(false);
  return (
    
    <div id="wd-courses">
      <h2 id="wd-course-title" className="text-primary"><FaAlignJustify className="me-4 fs-4 mb-1" />{course && course.number && course.number} {course && course.name && course.name} &gt; {pathname.split("/")[4]} &gt; {(quizzes) && (quiz) && quiz.title} {(assignments) && (assignment) && assignment.title}</h2>

      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CoursesNavigation />
        </div>

        <div className="flex-fill">
          <ViewProvider>
            <Routes>
              
              <Route path="Home" element={<Home collapsed={collapsed} setCollapsed={setCollapsed} allIconsVisible={allIconsVisible} setAllIconsVisible={setAllIconsVisible} toggleAllIcons={toggleAllIcons} visibleIcons={visibleIcons} toggleIcons={toggleIcons}/>} />
              <Route path="Modules" element={<Modules collapsed={collapsed} setCollapsed={setCollapsed} allIconsVisible={allIconsVisible} setAllIconsVisible={setAllIconsVisible} toggleAllIcons={toggleAllIcons} visibleIcons={visibleIcons} toggleIcons={toggleIcons}/>} />
              <Route path="Assignments" element={<Assignments />} />
              <Route path="Assignments/:aid" element={<AssignmentEditor />} />
              <Route path="Assignments/new" element={<AssignmentEditor />} />
              <Route path="Assignments/take/:aid" element={<TakeAssignment />} />
              <Route path="Quizzes" element={<Quizzes newQuizId={newQuizId} quizzes={quizzes} />} />
              <Route path="Quizzes/:qid" element={<QuizDetails/>} />
              <Route path="Quizzes/:qid/Editor/*" element={<EditorNavigation newQuizId={newQuizId} quizzes={quizzes}/>} />
              <Route path="Quizzes/:qid/Preview/*" element={<QuizPreview/>} />
              <Route path="Quizzes/:qid/PreviewResults" element={<QuizPreviewResults />} />
              <Route path="Quizzes/:qid/TakeQuiz" element={<TakeQuiz />} />
              <Route path="Quizzes/:qid/QuizResults" element={<QuizResults />} />
              <Route path="Grades" element={<Grades />} />
              <Route path="Grades/:uid" element={<GradeStudent />} />
              <Route path="Grades/:uid/:qid" element={<StudentQuizResults />} />
              <Route path="People" element={<PeopleTable />} />
              <Route path="Analytics" element={<Analytics />} />
              <Route path="Announcements" element={<Announcements />} />
              <Route path="Announcements/:anid" element={<AnnouncementEditor />} />
              <Route path="Notifications" element={<Announcements />} />
              
            </Routes>
          </ViewProvider>
        </div>

        
      </div>
    </div>
  );
}

  