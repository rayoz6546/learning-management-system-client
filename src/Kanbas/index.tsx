import { Routes, Route, Navigate, useNavigationType, useNavigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KanbasNavigation from "./Navigation";
import Courses from "./Dashboard/Courses"
import "./styles.css"
import { useEffect, useState } from "react";
import * as userClient from "./Account/client";
import ProtectedContent from "./Account/ProtectedContent";
import ProtectedRoute from "./Account/ProtectedRoute";
import { ViewProvider } from "./Dashboard/Enrollment/EnrollmentView";
// import {deleteCourse, updateCourse} from "./Dashboard/Courses/reducer"
import { useDispatch, useSelector } from "react-redux";
import Session from "./Account/Session";
import * as courseClient from "./Dashboard/Courses/client";
// import { setCourses } from "./Dashboard/Courses/reducer";
import {enroll, unEnroll} from "./Dashboard/Enrollment/reducer";
import * as peopleClient from "./Dashboard/Courses/People/client"

export default function Kanbas() {


  
  const [course, setCourse] = useState<any>({
    _id: new Date().getTime().toString(), name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",  image: "/images/react.jpg", description: "New Description",
  });  

  const [courses, setCourses] = useState<any[]>([])   // this holds courses for current user

  const [allCourses, setAllCourses] = useState<any[]>([])



  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { currentUser } = useSelector((state: any) => state.accountReducer);


  const fetchAllCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses()    // to render on screen when student clicks on "Enrollments"
      setAllCourses(allCourses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const courses = await userClient.findCoursesForUser(currentUser._id); 
      setCourses(courses)
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchAllCourses();

  }, []);

  useEffect(() => {
    fetchUserCourses();

  }, [currentUser]);







  const addNewCourse = async () => {
    // const newCourse = await userClient.createCourse(course);
    const newCourse = await courseClient.createCourse(course);
  
    setCourses([ ...courses, newCourse ]);
    enrollCourse(newCourse._id);
    
  };
  
  const deleteCourse = async (courseId: string) => {
   const status = await courseClient.deleteCourse(courseId);
 
    setCourses(courses.filter((course:any) => course._id !== courseId));
    unEnrollAll(courseId);
  };
  
  
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c:any) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })
  );};
  

  const enrollCourse = async (courseId: string) => {
    const c = await userClient.enrollIntoCourse(currentUser._id, courseId);
    setCourses([ ...courses, c ]);
    fetchUserCourses();
    fetchAllCourses();

  }
  const unEnrollAll = async (courseId:string) => {
    const status = await userClient.unenrollAll(courseId);
    setCourses(courses.filter((course:any) => course._id !== courseId));
    fetchAllCourses();
  }

  const unErollCourse = async (courseId: string) => {
    const status = await userClient.unenrollFromCourse(currentUser._id, courseId);
    setCourses(courses.filter((course:any) => course._id !== courseId));


  }

  


  

  return (
    <Session>
    <div id="wd-kanbas">
        <KanbasNavigation />
        <div className="wd-main-content-offset p-3">
          <ViewProvider>
      <Routes>
        <Route path="/" element={<Navigate to="Dashboard" />} />
        <Route path="/Account/*" element={<Account />} />
        <Route path="/Dashboard" element={<ProtectedRoute><Dashboard 
                      course = {course}
                      setCourse = {setCourse}
                      courses = {courses}
                      setCourses = {setCourses}
                      allCourses = {allCourses}
                      addNewCourse = {addNewCourse}
                      deleteCourse={deleteCourse}
                      updateCourse={updateCourse}
                      enrollCourse={enrollCourse}
                      unEnrollCourse = {unErollCourse}
                      /></ProtectedRoute>} />
        <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses}/></ProtectedRoute>} />
        <Route path="/Calendar" element={<h1>Calendar</h1>} />
        <Route path="/Inbox" element={<h1>Inbox</h1>} />
      </Routes>
      </ViewProvider>  
      </div>

    </div>
    </Session>
);}

  