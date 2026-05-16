import { FaPlus } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { MdAssignmentAdd } from "react-icons/md";
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import { IoMdArrowDropdown } from "react-icons/io";
import {  useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment, setAssignments} from "./reducer";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import AssignmentRemove from "./AssignmentRemove";
import { useEffect, useState } from "react";
import ProtectedContent from "../../../Account/ProtectedContent";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import * as coursesClient from "../client";
import * as assignmentsClient from "../Assignments/client"


export default function Assignments() {
    const { cid } = useParams()
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [assignmentToDelete, setAssignmentToDelete] = useState("")


    const fetchAssignments = async () => {
      const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    };
    useEffect(() => {
      fetchAssignments();
    }, []);
  
    
    const removeAssignment = async (assignmentId: string) => {
      await assignmentsClient.deleteAssignment(assignmentId);
      dispatch(deleteAssignment(assignmentId));
    };


    return (
      
      <div id="wd-assignments row" className="p-5">
          

          <div className="row mb-5">

          <div className="col">
          <input type="search" className="form-control rounded-0 me-1 wd-search-bar" id="wd-search-assignment" 
          placeholder="     Search..." style={{width:"300px"}}/>
          </div>

        <ProtectedContent>
          <div className="col">
          <div className="col">
          <button id="wd-add-assignment-btn" className="btn btn-lg btn-danger fs-6 rounded-1 float-end"
           onClick={() => navigate(`/Kanbas/Courses/${cid}/Assignments/new`)}>
          <FaPlus className="position-relative me-2" style={{ bottom: "1px"}} />
          Assignment</button>
          </div>



          <div className="col">
          <button id="wd-add-assignment-btn" className="btn btn-lg btn-secondary fs-6 rounded-1 float-end me-2">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group</button>
          </div>
          </div>

          </ProtectedContent>
          </div>
          <div className="row">
        <ul className="list-group rouded-0">
        <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
  
          <div className="wd-title p-3 ps-2 bg-secondary"><BsGripVertical className="me-2 fs-3" /><IoMdArrowDropdown className="me-2"/>ASSIGNMENTS<AssignmentsControlButtons /></div>

          {assignments
          // .filter((assignment: any) => assignment.course==cid)
          .map((assignment: any) =>(
            <ul id="wd-assignment-list" className="wd-lessons list-group rounded-0">
                <li className="wd-assignment-list-item list-group-item p-3 ps-1"><BsGripVertical className="me-2 fs-3" style={{color:"green"}}/><MdAssignmentAdd className="me-3 fs-3" style={{color:"green"}}/>
                <ProtectedContent><a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments/${assignment._id}`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a><LessonControlButtons /><FaTrash className="float-end me-2 mt-1 fs-4" data-bs-toggle="modal" data-bs-target="#wd-add-assignment-dialog" style={{color:"red"}}
              onClick={()=>setAssignmentToDelete(assignment._id)}/></ProtectedContent>

            <ProtectedContentEnrollment><a className="wd-assignment-link" href={`#/Kanbas/Courses/${cid}/Assignments`} style={{fontWeight:'bold'}}>{`${assignment.title}`}</a>
              </ProtectedContentEnrollment>  
              <br />

              <AssignmentRemove
                dialogTitle="Delete Assignment"
                deleteAssignment={(id) => {
                    removeAssignment(id);
                    setAssignmentToDelete(""); 
                }}
                assignmentId={assignmentToDelete} 
            />
              <p className="wd-assignment-info" style={{width:'590px'}}><span style={{color:'red'}}>Multiple Modules</span> | <strong>Not available until</strong> {`${assignment.available_from}`} | <strong>Due</strong> {`${assignment.due_date}`} | {`${assignment.points}`} pts</p>
            </li>
            
          </ul>
          
          ))
          }

    </li>

    </ul>
    </div>
      </div>
  );}
  