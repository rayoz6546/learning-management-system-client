import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { MdAssignmentAdd } from "react-icons/md";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import { IoMdArrowDropdown } from "react-icons/io";
import {  useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment, setAssignments, updateAssignment} from "./reducer";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import AssignmentRemove from "./AssignmentRemove";
import { useEffect, useState } from "react";
import ProtectedContent from "../../../Account/ProtectedContent";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import * as coursesClient from "../client";
import * as assignmentsClient from "../Assignments/client"
import * as modulesClient from "../Modules/client";
import { FiMoreVertical } from "react-icons/fi";
import { useViewContext } from "../Quizzes/View";
import StudentViewButton from "../Quizzes/StudentViewButton";
import { GrEdit } from "react-icons/gr";
import { CiNoWaitingSign } from "react-icons/ci";
import { IoEllipsisVertical } from "react-icons/io5";
import * as filesClient from "../filesClient";
import { setFiles } from "../filesReducer";
import ProtectedContentAdmin from "../../../Account/ProtectedContentAdmin";

export default function Assignments() {
    const { cid } = useParams()
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [assignmentToDelete, setAssignmentToDelete] = useState("")

    const [isLoading, setIsLoading] = useState(true); 
    const [visibleIcons, setVisibleIcons] = useState<Record<string, boolean>>({});
    const toggleAllIcons = () => {

      const allCurrentlyVisible = assignments.every((ass:any) => visibleIcons[ass._id]);
      const newVisibility = assignments.reduce((acc:any, ass:any) => {
          acc[ass._id] = !allCurrentlyVisible; 
          return acc;
      }, {});
      setVisibleIcons(newVisibility);
  };

  const toggleIcons = (assignmentId: string) => {
      setVisibleIcons((prev) => ({
          ...prev,
          [assignmentId]: !prev[assignmentId],
      }));
  };


    const fetchAssignments = async () => {
      const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    };

  
    
    const removeAssignment = async (assignmentId: string) => {
      const file = files.find((f:any)=> f.itemId===assignmentId) 
      await assignmentsClient.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
      if (file) { 

      await filesClient.deleteFile(file._id);}
    };
    

    const handlePublishToggle = async (assignment:any) => {
        const updatedPublished = !assignment.published;
    
        await assignmentsClient.updateAssignment({...assignment, published: updatedPublished});

        dispatch(updateAssignment({ ...assignment, published: updatedPublished}));
    
        };
    
    const { isStudentView, toggleView } = useViewContext();

    const { files } = useSelector((state: any) => state.filesReducer);

  const fetchFiles = async () => {
    try {
        const fetchedFiles = await filesClient.fetchFiles();
        console.log("Fetched files:", fetchedFiles); // Log the response
        if (!Array.isArray(fetchedFiles)) {
            console.error("Invalid response from filesClient.fetchFiles, expected an array but got:", fetchedFiles);
            return;
        }
        dispatch(setFiles(fetchedFiles));
    } catch (error) {
        console.error("Error fetching files:", error);
    }
};
  const [collapsed, setCollapsed] = useState(false);



  const toggleCollapseAll = () => {
    setCollapsed(!collapsed);
  };

    const calculateAvailability = (dueDate: any, availableFrom: any, availableUntil: any) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);


      const dueDateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);
      const availableFromObj = availableFrom instanceof Date ? availableFrom : new Date(availableFrom);
      const availableUntilObj = availableUntil instanceof Date ? availableUntil : new Date(availableUntil);


      dueDateObj.setHours(0, 0, 0, 0);
      availableFromObj.setHours(0, 0, 0, 0);
      availableUntilObj.setHours(0, 0, 0, 0);

      if (today > availableUntilObj) {
          return "Closed"

      }

      if (today > availableFromObj && today < availableUntilObj) {
          return "Available"

      }

      if (today < availableFromObj) {
          return "Not Available Until"

      }
  
  };

  useEffect(() => {
    // Fetch data and set loading state
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchFiles(), fetchAssignments()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }

    return (
      <>
        <ProtectedContent>
          
          <StudentViewButton
          isStudentView={isStudentView}
          onClick={toggleView}
          />

          {isStudentView ? (
            <div id="wd-assignments" className="p-3 ">
                <div className="row mb-5">
              
                <div className="col mb-3">

                <div className="col">
                    <button id="wd-quiz-menu-btn" className="btn ms-1 btn-lg btn-secondary fs-6 rounded-1 float-end"
                    onClick={()=>toggleAllIcons()}>
                        <FiMoreVertical /></button>
                </div>
                <div className="col">
     
                <button id="wd-add-assignment-btn" className="btn btn-lg btn-primary fs-6 rounded-1 float-end"
                onClick={() => navigate(`/Kanbas/Courses/${cid}/Assignments/new`)}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px"}} />
                Assignment</button>
                </div>

                <div className="col">
                  <button
                  id="wd-collapse-all"
                  className="btn btn-lg btn-secondary fs-6 me-1 float-end"
                  onClick={toggleCollapseAll}
                >
                  {collapsed ? "Uncollapse All" : "Collapse All"}
                </button>
              </div>
                </div>
                
                
                <hr />

                <div className="row">
              <ul className="list-group rounded-0">
              <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
        
                <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ASSIGNMENTS</div>
                <ul id="wd-assignment-list" className="wd-lessons list-group rounded-0">
                {!collapsed && assignments
                .map((assignment: any) =>(
                  
                      <li className="wd-assignment list-group-item p-3 ps-1 d-flex align-items-center">
                        <div className="d-flex align-items-center">
                        <MdAssignmentAdd className="ms-2 me-3 fs-3" style={{color:"darkblue"}}/>

                    <div className={`wd-${assignment._id}`}>
                      <a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a>
                      <br />
                      
                      

                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Available" ? <span><strong>Available </strong>| </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Not Available Until" ? <span><strong>Not Available Until</strong> {`${assignment.available_from.toString().split("T")[0]}`} | </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Closed" ? <span><strong>Closed </strong>| </span> : null }
                      <strong>Due</strong> {`${assignment.due_date.toString().split("T")[0]}`} | {(assignment.points!=="") ? `${assignment.points}` : "-"} pts
                    </div>
                    </div>
                      
                      <div className="ms-auto d-flex align-items-center">
                            {visibleIcons[assignment._id] && (
                                <>
                                <FaTrash className="float-end me-2 text-danger" data-bs-toggle="modal" data-bs-target="#wd-add-assignment-dialog" style={{color:"red", cursor:"pointer"}}
                                onClick={()=>setAssignmentToDelete(assignment._id)}/>
                                  <AssignmentRemove
                                  dialogTitle="Delete Assignment"
                                  deleteAssignment={(id) => {
                                      removeAssignment(id);
                                      setAssignmentToDelete(""); 
                                  }}
                                  assignmentId={assignmentToDelete} 
                                    />
                                  <GrEdit 
                                        className="me-2 text-primary float-end"
                                        onClick={() =>
                                            navigate(
                                                `/Kanbas/Courses/${cid}/Assignments/${assignment._id}`
                                            )
                                        }
                                        style={{ cursor: "pointer" }}
                                    />

                                <span className="me-1 position-relative float-end" onClick={()=>handlePublishToggle(assignment)} >
                                  {assignment.published ? ( 
                                      <FaCheckCircle style={{ top: "0.5px", cursor:"pointer" }} className="me-1 text-success position-relative fs-5" />
                                  ) : ( 
                                      <CiNoWaitingSign className="fs-5 position-relative me-1" style={{ top: "0.5px", cursor:"pointer"  }}/>
                                  )}
                                  </span>
                                </>
                            )}
                            <div className="d-flex align-items-center">
                            <IoEllipsisVertical className="fs-6 float-end"onClick={() => toggleIcons(assignment._id)} style={{ cursor: "pointer" }}/>
                            </div>
                      </div>
                      </li>
                
                ))
                }</ul>

          </li>
          </ul>
          </div>
            </div></div>
            ):
            <>
               <div id="wd-assignments" className="p-3 ">
        <div className="row mb-5">
            <div className="col mb-3">
                        <button
                        id="wd-collapse-all"
                        className="btn btn-lg btn-secondary fs-6 me-1 float-end"
                        onClick={toggleCollapseAll}
                      >
                        {collapsed ? "Uncollapse All" : "Collapse All"}
                      </button>
                    </div>
                    <hr />
                


          <div className="row">
              <ul className="list-group rounded-0">
              <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
        
                <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ASSIGNMENTS</div>
                <ul id="wd-assignment-list" className="wd-assignment list-group rounded-0">
                {!collapsed && assignments
                .map((assignment: any) =>(
                  <>
                  {assignment.published && 
                  
                  <li className="wd-assignments list-group-item p-3 ps-1 d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <MdAssignmentAdd className="ms-2 me-3 fs-3" style={{color:"darkblue"}}/>

                      <div className={`wd-${assignment._id}`}>
                      <a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a>

                      <br />

                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Available" ? <span><strong>Available </strong>| </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Not Available Until" ? <span><strong>Not Available Until</strong> {`${assignment.available_from.toString().split("T")[0]}`} | </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Closed" ? <span><strong>Closed </strong>| </span> : null }
                      <strong>Due</strong> {`${assignment.due_date.toString().split("T")[0]}`} | {(assignment.points!=="") ? `${assignment.points}` : "-"} pts
                      </div>
                      
                    </div></li>
                }</>
                ))
                }</ul>

          </li>
          </ul>
          </div>

        </div>
        </div>
        </>   
            
            
            }
      
      </ProtectedContent>




      <ProtectedContentEnrollment>
      <div id="wd-assignments" className="p-3 ">
        <div className="row mb-5">
            <div className="col mb-3">
                        <button
                        id="wd-collapse-all"
                        className="btn btn-lg btn-secondary fs-6 me-1 float-end"
                        onClick={toggleCollapseAll}
                      >
                        {collapsed ? "Uncollapse All" : "Collapse All"}
                      </button>
                    </div>
                    <hr />
                


          <div className="row">
              <ul className="list-group rounded-0">
              <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
        
                <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ASSIGNMENTS</div>
                <ul id="wd-assignment-list" className="wd-assignment list-group rounded-0">
                {!collapsed && assignments
                .map((assignment: any) =>(
                  <>
                  {assignment.published && 
                  
                  <li className="wd-assignments list-group-item p-3 ps-1 d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <MdAssignmentAdd className="ms-2 me-3 fs-3" style={{color:"darkblue"}}/>

                      <div className={`wd-${assignment._id}`}>
                      <a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/take/${assignment._id}`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a>

                      <br />

                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Available" ? <span><strong>Available </strong>| </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Not Available Until" ? <span><strong>Not Available Until</strong> {`${assignment.available_from.toString().split("T")[0]}`} | </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Closed" ? <span><strong>Closed </strong>| </span> : null }
                      <strong>Due</strong> {`${assignment.due_date.toString().split("T")[0]}`} | {(assignment.points!=="") ? `${assignment.points}` : "-"} pts
                      </div>
                      
                    </div></li>
                }</>
                ))
                }</ul>

          </li>
          </ul>
          </div>

        </div>
        </div>
      </ProtectedContentEnrollment>



      <ProtectedContentAdmin>
      <div id="wd-assignments" className="p-3 ">
        <div className="row mb-5">
            <div className="col mb-3">
                        <button
                        id="wd-collapse-all"
                        className="btn btn-lg btn-secondary fs-6 me-1 float-end"
                        onClick={toggleCollapseAll}
                      >
                        {collapsed ? "Uncollapse All" : "Collapse All"}
                      </button>
                    </div>
                    <hr />
                


          <div className="row">
              <ul className="list-group rounded-0">
              <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
        
                <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ASSIGNMENTS</div>
                <ul id="wd-assignment-list" className="wd-assignment list-group rounded-0">
                {!collapsed && assignments
                .map((assignment: any) =>(
                  <>
                  {assignment.published && 
                  
                  <li className="wd-assignments list-group-item p-3 ps-1 d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <MdAssignmentAdd className="ms-2 me-3 fs-3" style={{color:"darkblue"}}/>

                      <div className={`wd-${assignment._id}`}>
                      <a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/take/${assignment._id}`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a>

                      <br />

                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Available" ? <span><strong>Available </strong>| </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Not Available Until" ? <span><strong>Not Available Until</strong> {`${assignment.available_from.toString().split("T")[0]}`} | </span> : null }
                      {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Closed" ? <span><strong>Closed </strong>| </span> : null }
                      <strong>Due</strong> {`${assignment.due_date.toString().split("T")[0]}`} | {(assignment.points!=="") ? `${assignment.points}` : "-"} pts
                      </div>
                      
                    </div></li>
                }</>
                ))
                }</ul>

          </li>
          </ul>
          </div>

        </div>
        </div>
      </ProtectedContentAdmin>
      </>
  );}
  