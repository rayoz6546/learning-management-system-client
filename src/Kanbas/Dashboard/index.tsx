
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProtectedContent from "../Account/ProtectedContent";
import ProtectedContentAdmin from "../Account/ProtectedContentAdmin";
import ProtectedContentEnrollment from "../Account/ProtectedContentEnrollment";
import { useViewContext } from "./Enrollment/EnrollmentView";
import * as userClient from "../Account/client";
import * as enrollmentsClient from "./Enrollment/client"
import * as courseClient from "./Courses/client";
import { addNewCourse, deleteCourse, setCourses, updateCourse } from "./Courses/reducer";
import { useEffect, useState } from "react";
import { setEnrollments } from "./Enrollment/reducer";



  export default function Dashboard() {

  const { isEnrollmentView, toggleView } = useViewContext();

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector((state:any) => state.enrollmentsReducer);
  const dispatch = useDispatch()

  const userEnrollments = enrollments.filter((e: any) => e.user === currentUser._id);
  const userCourses = courses.filter((course: any) =>
    userEnrollments.some((enrollment: any) => enrollment.course === course._id)
  );


  const [courseName, setCourseName] = useState("")
  const [courseNumber, setCourseNumber] = useState("")
  const [courseCredits, setCourseCredits] = useState(3)
  const [courseDescription, setCourseDescription] = useState("")
  const [courseDepartment, setCourseDepartment] = useState("Arts & Humanities")

  const [editedCourseName, setEditedCourseName] = useState("");
  const [editedCourseNumber, setEditedCourseNumber] = useState("");
  const [editedCourseCredits, setEditedCourseCredits] = useState(3);
  const [editedCourseDescription, setEditedCourseDescription] = useState("");
  const [editedCourseDepartment, setEditedCourseDepartment] = useState("Arts & Humanities");


  const departmentColors: Record<string, string> = {
    "arts & humanities": "#FFD700",
    "business & management": "#FF6347",
    "computer science & it": "#87CEEB",
    "engineering & technology": "#4682B4",
    "health sciences": "#32CD32",
    "law": "#D00000",
    "natural sciences": "#6A5ACD",
    "social sciences": "#FF69B4",
  };
  
  const getBackgroundColor = (department: string | undefined) => {
    if (!department) return "#D3D3D3";
    return departmentColors[department.toLowerCase()] || "#D3D3D3";
  };

  const [name, setName] = useState("");
  const [dep, setDep] = useState("");
  const [addCourse, setAddCourse] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const fetchAllCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses()    
      dispatch(setCourses(allCourses));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const enrollments = await enrollmentsClient.findAllEnrollments()  
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error(error);
    }
    
  }
  useEffect(() => {
    fetchAllCourses();
    fetchEnrollments();

  }, []);

  if (!currentUser || !currentUser._id) { 
    return (<div>no user</div>)
  }

  if (!courses) { 
    return (<div>no courses</div>)
  }

  if (!enrollments) { 
    return (<div>no enrollments</div>)
  }


  const filterCoursesByName = async (name: string) => {
    setName(name);
    if (name) {
      const courses = await courseClient.findCoursesByPartialName(name);
      dispatch(setCourses(courses))
    } else {
      fetchAllCourses();
    }};


    const filterCoursesByDepartment = async (dep:any) => {
      setDep(dep);
      
      if (dep!=="") {
        const fetchedCourses = await courseClient.findCoursesByDepartment(dep);
        dispatch(setCourses(fetchedCourses)); 
      } else {
        fetchAllCourses();
      }
    };
    

  const handleAddCourse = async() => {
    const course = {
      _id: new Date().getTime().toString(),
      name: courseName,
      number: courseNumber,
      credits: courseCredits,
      description: courseDescription,
      department: courseDepartment,
    }
    const newCourse = await courseClient.createCourse(course);
    dispatch(addNewCourse(newCourse))
    resetNewCourse()
    setAddCourse(false)
  }

  const handleDeleteCourse = async (courseId:string) => {
      await courseClient.deleteCourse(courseId)
      dispatch(deleteCourse(courseId))
      await enrollmentsClient.unenrollAll(courseId)
    
  }

  const handleUpdateCourse = async (courseId: string) => {
    try {
      const updatedCourse = {
        _id: courseId,
        name: editedCourseName,
        number: editedCourseNumber,
        credits: editedCourseCredits,
        description: editedCourseDescription,
        department: editedCourseDepartment,
      };
      await courseClient.updateCourse(updatedCourse); 
      dispatch(updateCourse(updatedCourse))
      setEditCourse(null); 
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const resetNewCourse = () => {
    setCourseName("")
    setCourseNumber("")
    setCourseCredits(3)
    setCourseDescription("")
    setCourseDepartment("Arts & Humanities")
  }

  const handleEnroll = async (courseId:string) => {

    await enrollmentsClient.enroll(currentUser._id, courseId)

    fetchEnrollments()
   
  }
  
  const handleUnenroll = async (courseId:string) => {
    await enrollmentsClient.unenroll(currentUser._id, courseId)
    fetchEnrollments()
 
  }
  return (
      <div id="wd-dashboard" className="p-2">
        <h1 id="wd-dashboard-title">Dashboard</h1> <hr />


        <ProtectedContentAdmin>
          
        <div>
        <input value={name} onChange={(e) => filterCoursesByName(e.target.value)} placeholder="Search courses"
             className="form-control float-start w-25 me-2 wd-filter-by-name" />

        <select value={dep} onChange={(e) =>filterCoursesByDepartment(e.target.value)}
                  className="form-select float-start w-25 wd-select-role" >
            <option value="">All Departments</option>    
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Computer Science & IT">Computer Science & IT</option>
            <option value="Engineering & Technology">Engineering & Technology</option>
            <option value="Health Sciences">Health Sciences</option>
            <option value="Law">Law</option>
            <option value="Natural Sciences">Natural Sciences</option>
            <option value="Social Sciences">Social Sciences</option>
  
            </select>
        <button className="btn btn-warning float-end" onClick={()=>setAddCourse((prev:any)=>!prev)}>Add Course</button>
        </div>
        <br /><br /><br />

{/*-------------------------------------------------ADDING NEW COURSE-------------------------------------------------------------------------------------------------------------- */}
        {addCourse && 
        <div style={{width:"700px", position:"relative"}} className="mb-5">
        <h5>New Course</h5>
        <button className="btn btn-secondary float-end mb-2" id="wd-cancel-add-course-click" onClick={()=> {setAddCourse(false); resetNewCourse()}}>Cancel </button>
        <button className="btn btn-primary float-end me-2 mb-2" id="wd-add-course-click" onClick={()=>{handleAddCourse()}}> Add </button>

        <br /><br />
      
        <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Name</p>
          <input className="form-control mb-2" onChange={(e) => setCourseName(e.target.value ) }/>
         </div>

         <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Number</p>
          <input className="form-control mb-2" onChange={(e) => setCourseNumber(e.target.value ) }/>
         </div>

         <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Credits</p>
          <input className="form-control mb-2" onChange={(e) => setCourseCredits(parseInt(e.target.value) ) }/>
         </div>
      
        <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Description</p>
          <textarea  className="form-control" onChange={(e) => setCourseDescription(e.target.value) }/>
        </div>


        <div style={{display:"flex"}}>
          <p style={{width:"150px"}}>Department</p>

          <select  onChange={(e) =>setCourseDepartment(e.target.value)} className="form-select mt-2 wd-select-role" > 
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Computer Science & IT">Computer Science & IT</option>
            <option value="Engineering & Technology">Engineering & Technology</option>
            <option value="Health Sciences">Health Sciences</option>
            <option value="Law">Law</option>
            <option value="Natural Sciences">Natural Sciences</option>
            <option value="Social Sciences">Social Sciences</option>

            </select>
        </div>

        </div>
        }
{/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
        
    <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
        <div id="wd-dashboard-courses" className="row">
          <div className="row row-cols-1 row-cols-md-5 g-4">

            {courses.map((course:any)=> (
              <>
              <div className="wd-dashboard-course col" style={{ width: "300px"}}>
             
                  <div className="card rounded-3 overflow-hidden">
                    <div style={{width:"100%",height:"160px", background: getBackgroundColor(course.department)}}   />
                      <div className="card-body">
                     <h5 className="wd-dashboard-course-title card-title" style={{fontWeight:"bold", color:getBackgroundColor(course.department)}}>{course.number} {course.name} </h5>
                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>{course.description} </p>
                          <Link to={`/Kanbas/Courses/${course._id}/Home`}
                            className="wd-dashboard-course-link text-decoration-none text-dark" >
                            <button className="btn btn-primary"> Go </button>
                            </Link>
                            <button onClick={()=>{handleDeleteCourse(course._id)}} className="btn btn-danger float-end" id="wd-delete-course-click">Delete</button>

                            <button id="wd-edit-course-click" className="btn btn-warning me-2 float-end" 
                              onClick={()=>{setEditCourse(course._id);
                                setEditedCourseName(course.name || "");
                                setEditedCourseNumber(course.number || "");
                                setEditedCourseCredits(course.credits || 3);
                                setEditedCourseDescription(course.description || "");
                                setEditedCourseDepartment(course.department || "Arts & Humanities");
                              }}
                              > Edit </button>
                    </div>
                    </div>
                </div>

                {editCourse===course._id && (
                    <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25" style={{zIndex:"100"}}>
                      <div className="modal-content">
                        <h5>Edit Course: {course.number}</h5>
                        <button className="btn btn-primary float-end mb-2" id="wd-add-course-click" onClick={()=>{handleUpdateCourse(course._id);setEditCourse(null)}}>Update</button>
                        <button className="btn btn-secondary float-end mb-2" onClick={() => { setEditCourse(null); resetNewCourse(); }} >Cancel</button>
                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Name</p>
                          <input className="form-control mb-2" value={editedCourseName} onChange={(e) => setEditedCourseName(e.target.value) }/>
                        </div>

                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Number</p>
                          <input className="form-control mb-2" value={editedCourseNumber} onChange={(e) => setEditedCourseNumber(e.target.value ) }/>
                        </div>

                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Credits</p>
                          <input className="form-control mb-2" value={editedCourseCredits || 0} onChange={(e) => setEditedCourseCredits(parseInt(e.target.value) ) }/>
                        </div>
                      
                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Description</p>
                          <textarea  className="form-control" value={editedCourseDescription} onChange={(e) => setEditedCourseDescription(e.target.value) }/>
                        </div>


                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Department</p>

                          <select value={editedCourseDepartment} onChange={(e) =>setEditedCourseDepartment(e.target.value)} className="form-select mt-2 wd-select-role" > 
                            <option value="Arts & Humanities">Arts & Humanities</option>
                            <option value="Business & Management">Business & Management</option>
                            <option value="Computer Science & IT">Computer Science & IT</option>
                            <option value="Engineering & Technology">Engineering & Technology</option>
                            <option value="Health Sciences">Health Sciences</option>
                            <option value="Law">Law</option>
                            <option value="Natural Sciences">Natural Sciences</option>
                            <option value="Social Sciences">Social Sciences</option>

                            </select>
                        </div>
                      </div>
                    </div> 
                  )}

              </>
                
            ))}

            </div>
            
        </div>
      
        </ProtectedContentAdmin>





        <ProtectedContentEnrollment>
        
        <h2 id="wd-dashboard-published">Published Courses ({userCourses.length})</h2> <hr />
        <div id="wd-dashboard-courses" className="row">
        <h5><button className="btn btn-primary float-end" onClick={toggleView}>{isEnrollmentView? "Enroll in Courses" : "View My Courses"}</button></h5>
        {isEnrollmentView ? 
          <div className="row row-cols-1 row-cols-md-5 g-4">
            
            {userCourses.map((course:any)=> (
              <>
              <div className="wd-dashboard-course col" style={{ width: "300px"}}>
             
                  <div className="card rounded-3 overflow-hidden">
                    <div style={{width:"100%",height:"160px", background: getBackgroundColor(course.department)}}   />
                      <div className="card-body">
                     <h5 className="wd-dashboard-course-title card-title" style={{fontWeight:"bold", color:getBackgroundColor(course.department)}}>{course.number} {course.name} </h5>
                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>{course.description} </p>
                          <Link to={`/Kanbas/Courses/${course._id}/Home`}
                            className="wd-dashboard-course-link text-decoration-none text-dark" >
                            <button className="btn btn-primary"> Go </button>
                            </Link>

                            
                    </div>
                    </div>
                </div>

               </>))}

               </div> : 
              
              
              <div className="row row-cols-1 row-cols-md-5 g-4">
            
            {courses.map((course:any)=> (
              <>
              <div className="wd-dashboard-course col" style={{ width: "300px"}}>
             
                  <div className="card rounded-3 overflow-hidden">
                    <div style={{width:"100%",height:"160px", background: getBackgroundColor(course.department)}}   />
                      <div className="card-body">
                     <h5 className="wd-dashboard-course-title card-title" style={{fontWeight:"bold", color:getBackgroundColor(course.department)}}>{course.number} {course.name} </h5>
                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>{course.description} </p>
                        {userCourses.some((c: any)=> c._id === course._id) ? 
                            <button onClick=
                            {(event) => {event.preventDefault();
                              handleUnenroll(course._id)
                            }}
                              className="btn btn-danger float-end"
                              id="wd-unenroll-course-click">
                              Unenroll
                            </button> : 
                            
                            <button onClick=
                            {(event) => {event.preventDefault(); 
                              handleEnroll(course._id)        
                            }}

                      className="btn btn-primary float-end"
                      id="wd-enroll-course-click"> 
                      Enroll </button>
                            }

                    </div>
                    </div>
                </div>
               </>))}

               </div>}
               </div>
               
                
        </ProtectedContentEnrollment>



        <ProtectedContent>
        
        <h2 id="wd-dashboard-published">Published Courses ({userCourses.length})</h2> <hr />
        <div id="wd-dashboard-courses" className="row">
        <h5><button className="btn btn-primary float-end" onClick={toggleView}>{isEnrollmentView? "Enroll in Courses" : "View My Courses"}</button></h5>
        {isEnrollmentView ? 
          <div className="row row-cols-1 row-cols-md-5 g-4">
            
            {userCourses.map((course:any)=> (
              <>
              <div className="wd-dashboard-course col" style={{ width: "300px"}}>
             
                  <div className="card rounded-3 overflow-hidden">
                    <div style={{width:"100%",height:"160px", background: getBackgroundColor(course.department)}}   />
                      <div className="card-body">
                     <h5 className="wd-dashboard-course-title card-title" style={{fontWeight:"bold", color:getBackgroundColor(course.department)}}>{course.number} {course.name} </h5>
                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>{course.description} </p>
                          <Link to={`/Kanbas/Courses/${course._id}/Home`}
                            className="wd-dashboard-course-link text-decoration-none text-dark" >
                            <button className="btn btn-primary"> Go </button>
                            </Link>

                            <button id="wd-edit-course-click" className="btn btn-warning me-2 float-end" 
                              onClick={()=>{setEditCourse(course._id);
                                setEditedCourseName(course.name || "");
                                setEditedCourseNumber(course.number || "");
                                setEditedCourseCredits(course.credits || 3);
                                setEditedCourseDescription(course.description || "");
                                setEditedCourseDepartment(course.department || "Arts & Humanities");
                              }}
                              > Edit </button>
                    </div>
                    </div>
                </div>


                {editCourse===course._id && (
                    <div className="position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25" style={{zIndex:"100"}}>
                      <div className="modal-content">
                        <h5>Edit Course: {course.number}</h5>
                        <button className="btn btn-primary float-end mb-2" id="wd-add-course-click" onClick={()=>{handleUpdateCourse(course._id);setEditCourse(null)}}>Update</button>
                        <button className="btn btn-secondary float-end mb-2" onClick={() => { setEditCourse(null); resetNewCourse(); }} >Cancel</button>
                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Name</p>
                          <input className="form-control mb-2" value={editedCourseName} onChange={(e) => setEditedCourseName(e.target.value) }/>
                        </div>

                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Number</p>
                          <input className="form-control mb-2" value={editedCourseNumber} onChange={(e) => setEditedCourseNumber(e.target.value ) }/>
                        </div>

                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Credits</p>
                          <input className="form-control mb-2" value={editedCourseCredits || 0} onChange={(e) => setEditedCourseCredits(parseInt(e.target.value) ) }/>
                        </div>
                      
                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Description</p>
                          <textarea  className="form-control" value={editedCourseDescription} onChange={(e) => setEditedCourseDescription(e.target.value) }/>
                        </div>


                        <div style={{display:"flex"}}>
                          <p style={{width:"150px"}}>Department</p>

                          <select value={editedCourseDepartment} onChange={(e) =>setEditedCourseDepartment(e.target.value)} className="form-select mt-2 wd-select-role" > 
                            <option value="Arts & Humanities">Arts & Humanities</option>
                            <option value="Business & Management">Business & Management</option>
                            <option value="Computer Science & IT">Computer Science & IT</option>
                            <option value="Engineering & Technology">Engineering & Technology</option>
                            <option value="Health Sciences">Health Sciences</option>
                            <option value="Law">Law</option>
                            <option value="Natural Sciences">Natural Sciences</option>
                            <option value="Social Sciences">Social Sciences</option>

                            </select>
                        </div>
                      </div>
                    </div> 
                  )}
               </>))}

               </div> : 
              
              
              <div className="row row-cols-1 row-cols-md-5 g-4">
            
            {courses.map((course:any)=> (
              <>
              <div className="wd-dashboard-course col" style={{ width: "300px"}}>
             
                  <div className="card rounded-3 overflow-hidden">
                    <div style={{width:"100%",height:"160px", background: getBackgroundColor(course.department)}}   />
                      <div className="card-body">
                     <h5 className="wd-dashboard-course-title card-title" style={{fontWeight:"bold", color:getBackgroundColor(course.department)}}>{course.number} {course.name} </h5>
                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>{course.description} </p>
                        {userCourses.some((c: any)=> c._id === course._id) ? 
                            <button onClick=
                            {(event) => {event.preventDefault();
                              handleUnenroll(course._id)
                            }}
                              className="btn btn-danger float-end"
                              id="wd-unenroll-course-click">
                              Unenroll
                            </button> : 
                            
                            <button onClick=
                            {(event) => {event.preventDefault(); 
                              handleEnroll(course._id)        
                            }}

                      className="btn btn-primary float-end"
                      id="wd-enroll-course-click"> 
                      Enroll </button>
                            }

                    </div>
                    </div>
                </div>
               </>))}

               </div>}
               </div>
               
                
        </ProtectedContent>
      </div>

);
}


