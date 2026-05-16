import { TbPointFilled } from "react-icons/tb";
import { MdDateRange } from "react-icons/md";
import { useLocation, useParams } from "react-router";
import * as db from "../../../Database";
import { Link , useNavigate} from "react-router-dom";
import { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import * as coursesClient from "../client";
import * as assignmentsClient from "../Assignments/client"

export default function AssignmentEditor() {
    const { cid, aid } = useParams()
    const assignment = useSelector((state: any) =>
      state.assignmentsReducer.assignments.find((assignment: { _id: string | undefined; }) => assignment._id === aid)
    );

    const [assignmentName, setAssignmentName] = useState(assignment ? assignment.title : "");
    const [assignmentDescription, setAssignmentDescription] = useState(assignment ? assignment.description : "");
    const [assignmentPoints, setAssignmentPoints] = useState(assignment ? assignment.points : "");
    const [assignmentDue, setAssignmentDue] = useState(assignment ? assignment.due_date : "");
    const [assignmentFrom, setAssignmentFrom] = useState(assignment ? assignment.available_from : "");
    const [assignmentUntil, setAssignmentUntil] = useState(assignment ? assignment.until : "");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createAssignmentForCourse = async (newAssignment:any) => {
      if (!cid) return;

      const assignment = await coursesClient.createAssignmentForCourse(cid, newAssignment);
      dispatch(addAssignment(assignment));
    };

    const saveAssignment = async (assignment: any) => {
      await assignmentsClient.updateAssignment(assignment);
      dispatch(updateAssignment(assignment));
    };

    const save = () => {
      if (assignment) {
        const updatedAssignment = {
          _id: aid, 
          title: assignmentName,
          description: assignmentDescription,
          course: cid,
          points: assignmentPoints,
          due_date: assignmentDue,
          available_from: assignmentFrom,
          until: assignmentUntil
        }
        saveAssignment(updatedAssignment);

      } else {
      const assignment_ = {
        // _id : new Date().getTime().toString(), 
        title: assignmentName,
        description: assignmentDescription,
        course: cid,
        points: assignmentPoints,
        due_date: assignmentDue,
        available_from: assignmentFrom,
        until: assignmentUntil}

        // dispatch(addAssignment(assignment_))
        createAssignmentForCourse(assignment_)
        }
        navigate(`/Kanbas/Courses/${cid}/Assignments`)
    };
    


    return (
      <div className="container-fluid">
      <div id="wd-assignments-editor" className="p-5 row">


          
            <div className="row mb-1 p-1"><label htmlFor="wd-name">Assignment Name</label></div>
              <div className="row mb-2"><input id="wd-name" defaultValue={assignmentName} type="text" className="form-control"
              onChange={(e) => setAssignmentName(e.target.value)} /></div>
  
              <div className="row mb-5">
                <textarea name="wd-description" id="wd-description" className="form-control" defaultValue={assignmentDescription}
                onChange={(e) => setAssignmentDescription(e.target.value)} rows={5}></textarea>
              </div>
   

              <div className="row mb-2">
                    <div className="col"style={{textAlign:"right"}}>
                    <label htmlFor="wd-points" className="form-label">Points</label>
                    </div>

                    <div className="col">
                    <input type="text" className="form-control" id="wd-points" defaultValue={assignmentPoints}
                    onChange={(e) => setAssignmentPoints(e.target.value)}/>
                    </div>
              </div>


              <div className="row mb-2">
                <div className="col"style={{textAlign:"right"}}>
                  <label htmlFor="wd-assign-to" className="form-label">Assign</label>
                  </div>


                  <div className="col">
                      <ul className="list-group rounded-0 border">

                      <li className="list-group-item border-0">
                          <div className="row"><label htmlFor="wd-due-date" className="wd-due-date" style={{fontWeight:"bold"}}>Due</label></div>
                          <div className="row"><div className="input-group"><input type="datetime" name="wd-due-date" id="wd-due-date" className="form-control" defaultValue={assignmentDue}
                          onChange={(e) => setAssignmentDue(e.target.value)}/><span className="input-group-text"><MdDateRange /></span></div></div>
                          </li>

                      <li className="list-group-item border-0">
                        <div className="row">
                        <div className="col">
                          <div className="row"><label htmlFor="wd-available-from" className="wd-available-from" style={{fontWeight:"bold"}}>Available From</label></div>
                          <div className="row"><div className="input-group"><input type="datetime" name="wd-available-from" id="wd-available-from" className="form-control" defaultValue={assignmentFrom}
                          onChange={(e) => setAssignmentFrom(e.target.value)}/><span className="input-group-text"><MdDateRange /></span></div></div>
                          </div>

                          <div className="col">
                          <div className="row"><label htmlFor="wd-available-until" className="wd-available-until" style={{fontWeight:"bold"}}>Until</label></div>
                          <div className="row"><div className="input-group"><input type="datetime" name="wd-available-until" id="wd-available-until" className="form-control" defaultValue={assignmentUntil}
                          onChange={(e) => setAssignmentUntil(e.target.value)}/><span className="input-group-text"><MdDateRange /></span></div></div>
                          </div>
                          </div>
                          </li>
                      </ul>
                  </div>


              </div>
              

              <div className="row mt-5 mb-2">
                <div className="col">
                <hr />
                <div className="col"><button onClick={save} className="btn btn-danger float-end rounded-1" type="submit">Save</button></div>
                <div className="col"><Link to={`/Kanbas/Courses/${cid}/Assignments`}><button className="btn btn-secondary float-end me-2 rounded-1" type="submit">Cancel</button></Link></div>
              </div>
              </div>
    </div>
    </div>

);}
