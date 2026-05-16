
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { enroll, unEnroll } from "./Enrollment/reducer";
import ProtectedContent from "../Account/ProtectedContent";
import ProtectedContentAdmin from "../Account/ProtectedContentAdmin";
import ProtectedContentEnrollment from "../Account/ProtectedContentEnrollment";
import { useViewContext } from "./Enrollment/EnrollmentView";
import * as userClient from "../Account/client";

import * as courseClient from "./Courses/client";
import { setCourses } from "./Courses/reducer";
import { useState } from "react";


export default function Dashboard(
  {course, setCourse, courses, setCourses, allCourses, addNewCourse, deleteCourse, updateCourse, enrollCourse, unEnrollCourse}: {
  course:any ; setCourse : any ; courses: any; setCourses:any; allCourses:any;
  addNewCourse: ()=> void; deleteCourse: (courseId:any) => void; updateCourse: (courseId:any) => void; enrollCourse:(courseId:any)=>void; unEnrollCourse: (courseId:any)=>void;
 } 
) {


  const { isEnrollmentView, toggleView } = useViewContext();



  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />

<ProtectedContentAdmin>
      <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={()=>{
                  const newCourse = { ...course, _id: new Date().getTime().toString(), image:"/images/react.jpg" };
                  setCourse(newCourse);  addNewCourse()}}
                  >
                    Add </button>
                    

          <button className="btn btn-warning float-end me-2"
                onClick={()=>updateCourse(course)} 
                id="wd-update-course-click">
          Update
        </button>
      </h5><br />
      <input value={course.name} className="form-control mb-2"              
        onChange={(e) => setCourse({ ...course, name: e.target.value }) }
         />
      
      <textarea value={course.description} className="form-control"
        onChange={(e) => setCourse({ ...course, description: e.target.value }) }
        />
        </ProtectedContentAdmin>

        <ProtectedContent>
      <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={()=>{
                  const newCourse = { ...course, _id: new Date().getTime().toString(), image:"/images/react.jpg" };
                  setCourse(newCourse);  addNewCourse()}}
                  >
                    Add </button>
                    

          <button className="btn btn-warning float-end me-2"
                onClick={()=>updateCourse(course)} 
                id="wd-update-course-click">
          Update
        </button>
      </h5><br />
      <input value={course.name} className="form-control mb-2"              
        onChange={(e) => setCourse({ ...course, name: e.target.value }) }
         />
      
      <textarea value={course.description} className="form-control"
        onChange={(e) => setCourse({ ...course, description: e.target.value }) }
        />
        </ProtectedContent>

        <ProtectedContentEnrollment>
          <h5><button className="btn btn-primary float-end" onClick={toggleView}>{isEnrollmentView? "All Courses" : "My Courses"}</button></h5>
          
        </ProtectedContentEnrollment>

        <ProtectedContent>
          <h5><button className="btn btn-primary float-end" onClick={toggleView}>{isEnrollmentView? "All Courses" : "My Courses"}</button></h5>
          
        </ProtectedContent>



      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">



{isEnrollmentView ? 
        (courses
        .map((course: any) => (

          

            <div className="wd-dashboard-course col" style={{ width: "300px"}}>
        

              <div className="card rounded-3 overflow-hidden">

                  <img src={course.image} width="100%" height={160} />
                  <div className="card-body">
                    <h5 className="wd-dashboard-course-title card-title">
                      {course.name} </h5>
                    <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                      {course.description} </p>
                      <Link to={`/Kanbas/Courses/${course._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                    <button className="btn btn-primary"> Go </button>
                    </Link>

                    
                <ProtectedContentAdmin>
                    <button onClick={()=>{deleteCourse(course._id)}} 

                    className="btn btn-danger float-end"
                    id="wd-delete-course-click">
                    Delete
                  </button>

                  <button id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
    
                        className="btn btn-warning me-2 float-end" >
                        Edit
                      </button>
                      </ProtectedContentAdmin>

                      <ProtectedContent>
                    <button onClick={()=>{deleteCourse(course._id)}} 

                    className="btn btn-danger float-end"
                    id="wd-delete-course-click">
                    Delete
                  </button>

                  <button id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
    
                        className="btn btn-warning me-2 float-end" >
                        Edit
                      </button>
                      </ProtectedContent>
                  </div>
                
              </div>
            </div>
          )))
        : 
        (allCourses
      .map((course: any) => (
          
          <div className="wd-dashboard-course col" style={{ width: "300px"}}>
            <div className="card rounded-3 overflow-hidden">
              <div className="wd-dashboard-course-link text-decoration-none text-dark">
                  
                <img src={course.image} width="100%" height={160} />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {course.name} </h5>
                  <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                    {course.description} </p>
                  </div>

                  {courses.some((c: any)=> c._id === course._id) ? 
                  
                  <button onClick=
                  {(event) => {event.preventDefault();
                    unEnrollCourse(course._id)
                  }}
                     className="btn btn-danger float-end"
                    id="wd-unenroll-course-click">
                    Unenroll
                  </button> : 
                  
                  <button onClick=
                  {(event) => {event.preventDefault(); enrollCourse(course._id)        
                  }}

            className="btn btn-primary float-end"
            id="wd-enroll-course-click"> 
             Enroll </button>
                  }


                  
                  </div></div></div>
                  )) )
                  
                  }

        </div>
      </div>
    </div>
);
}


