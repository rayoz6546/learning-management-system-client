import { MdAssignmentAdd, MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { IoMdHome } from "react-icons/io";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoIosNotifications } from "react-icons/io";
import ProtectedContent from "../../../Account/ProtectedContent";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setAnnouncements } from "../Announcements/reducer";
import * as coursesClient from "../client";
import { useEffect, useState } from "react";
import { setQuizzes } from "../Quizzes/quizzesReducer";
import { setAssignments } from "../Assignments/reducer";
import { IoRocketOutline } from "react-icons/io5";
export default function CourseStatus({isStudentView}:{isStudentView:Boolean}) {
  const navigate = useNavigate()
  const {cid} = useParams()
  const {announcements} = useSelector((state:any)=>state.announcementsReducer)
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); 
  const [notifications, setNotifications] = useState(false)
  const {quizzes} = useSelector((state:any) => state.quizzesReducer)
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const fetchQuizzes = async () => {
      const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
  
      dispatch(setQuizzes(quizzes));

      };

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string)
        dispatch(setAssignments(assignments))
    }
  const fetchAnnouncements = async () => {
    const announcements = await coursesClient.findAnnouncementsForCourse(cid as string);
    console.log(announcements)
    dispatch(setAnnouncements(announcements));
  };
        useEffect(() => {
          const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchAnnouncements(), fetchAssignments(), fetchQuizzes()]);
            setIsLoading(false);
          };
          fetchData();
        }, []);
      
        if (isLoading) {
          return <div>Loading...</div>; 
        }
  return (
    <div id="wd-course-status" style={{ width: "300px" }}>
      <h2>Course Status</h2>
      {isStudentView ? (
        <>
      

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick={()=>navigate(`/Kanbas/Courses/${cid}/Announcements`)}>
        <TfiAnnouncement className="me-2 fs-5"/> Announcements ({announcements.length})</button>

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick={()=>setNotifications((prev:any)=>!prev)}>
        <IoIosNotifications className="me-2 fs-5" /> View Course Notifications </button>

        {notifications && 
        <>
        <div className="p-3">
        <h5><strong>Published Material</strong></h5><hr />
        {announcements.map((a:any)=>
          <> <div key={a._id} className="d-flex align-items-center">
            <TfiAnnouncement className="me-3"/>
            <a href={`#/Kanbas/Courses/${cid}/Announcements/${a._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}}>{a.title}</a><br />
            </div>
          </>)}
        {assignments.map((a:any)=>
          <>
          <div key={a._id} className="d-flex align-items-center">
          <MdAssignmentAdd className="me-3"/>
          <a href={`#/Kanbas/Courses/${cid}/Assignments/take/${a._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}} className="me-2">{a.published && a.title}</a><span className="text-muted">Due: {a.due_date.toString().split("T")[0]}</span> <br />
          </div>
          
          </>)}

          {quizzes.map((q:any)=>
          <>
            <div key={q._id} className="d-flex align-items-center">
          <IoRocketOutline className="me-3"/>
          <a href={`#/Kanbas/Courses/${cid}/Quizzes/${q._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}} className="me-2">{q.published && q.title}</a> <span className="text-muted">Due: {q.due_date.toString().split("T")[0]}</span> <br />
          </div>
          </>)}

        </div>
        </>}

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick={()=>navigate(`/Kanbas/Courses/${cid}/Analytics`)}>
        <BiSolidBarChartAlt2 className="me-2 fs-5"/> Vew Analytics </button>

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick = {() => window.open("https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook","_blank")}>
        <MdEmail className="me-2 fs-5" /> Outlook </button>

        </>
) : 
<>

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick={()=>navigate(`/Kanbas/Courses/${cid}/Announcements`)}> 
        <TfiAnnouncement className="me-2 fs-5" /> Announcements ({announcements.length})</button>

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick={()=>setNotifications((prev:any)=>!prev)}>
        <IoIosNotifications className="me-2 fs-5" /> View Course Notifications </button>

        {notifications && 
        <>
        <div className="p-3">
        <h5><strong>Published Material</strong></h5><hr />
        {announcements.map((a:any)=>
          <> <div key={a._id} className="d-flex align-items-center">
            <TfiAnnouncement className="me-3"/>
            <a href={`#/Kanbas/Courses/${cid}/Announcements/${a._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}}>{a.title}</a><br />
            </div>
          </>)}
        {assignments.map((a:any)=>
          <>
          <div key={a._id} className="d-flex align-items-center">
          <MdAssignmentAdd className="me-3"/>
          <a href={`#/Kanbas/Courses/${cid}/Assignments/${a._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}} className="me-2">{a.published && a.title}</a><span className="text-muted">Due: {a.due_date.toString().split("T")[0]}</span> <br />
          </div>
          
          </>)}

          {quizzes.map((q:any)=>
          <>
            <div key={q._id} className="d-flex align-items-center">
          <IoRocketOutline className="me-3"/>
          <a href={`#/Kanbas/Courses/${cid}/Quizzes/${q._id}`} style={{overflow: 'hidden',textOverflow: 'ellipsis',maxWidth: '200px', whiteSpace:"nowrap"}} className="me-2">{q.published && q.title}</a> <span className="text-muted">Due: {q.due_date.toString().split("T")[0]}</span> <br />
          </div>
          </>)}

        </div>
        </>}

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start"  onClick={()=>navigate(`/Kanbas/Courses/${cid}/Analytics`)}>
        <BiSolidBarChartAlt2 className="me-2 fs-5" /> Vew Analytics </button>

        <button className="btn btn-lg btn-secondary w-100 mt-1 text-start" onClick = {() => window.open("https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook","_blank")}>
        <MdEmail className="me-2 fs-5" /> Outlook </button></>}

    </div>
);}

  