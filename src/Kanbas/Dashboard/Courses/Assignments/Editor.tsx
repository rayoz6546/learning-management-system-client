import { TbPointFilled } from "react-icons/tb";
import { MdDateRange } from "react-icons/md";
import { useLocation, useParams } from "react-router";
import { Link , useNavigate} from "react-router-dom";
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, setAssignments, updateAssignment } from "./reducer";
import * as coursesClient from "../client";
import * as assignmentsClient from "../Assignments/client"
import * as modulesClient from "../Modules/client";
import * as filesClient from "../filesClient";
import { addFile, deleteFile, setFiles } from "../filesReducer";
import ProtectedContent from "../../../Account/ProtectedContent";
import StudentViewButton from "../Quizzes/StudentViewButton";
import { useViewContext } from "../Quizzes/View";
import { CgDanger } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import Editor from 'react-simple-wysiwyg';
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { files } = useSelector((state: any) => state.filesReducer);

  const assignment = assignments.find((a: any) => a._id === aid);

  const [isLoading, setIsLoading] = useState(true);


  const [assignmentName, setAssignmentName] = useState(assignment ? assignment.title : "New Assignment");
  const [assignmentDescription, setAssignmentDescription] = useState(assignment ? assignment.description : "");
  const [assignmentPoints, setAssignmentPoints] = useState(assignment ? assignment.points : null);
  const [assignmentDue, setAssignmentDue] = useState(assignment ? assignment.due_date : "");
  const [assignmentFrom, setAssignmentFrom] = useState(assignment ? assignment.available_from : "");
  const [assignmentUntil, setAssignmentUntil] = useState(assignment ? assignment.until : "");
  const [assignmentAttempts, setAssignmentAttempts] = useState(assignment ? assignment.attempts : 1);
  const [assignmentPercentage, setAssignmentPercentage] = useState(assignment ? assignment.percentage : null);
  const [assignmentPublished, setAssignmentPublished] = useState(assignment ? assignment.published : false);
  const [file, setFile] = useState(assignment ? assignment.file : "");
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  useEffect(() => {
    if (assignment) {
        setAssignmentName(assignment.title);
        setAssignmentDescription(assignment.description);
        setAssignmentPoints(assignment.points);
        setAssignmentDue(assignment.due_date);
        setAssignmentFrom(assignment.available_from);
        setAssignmentUntil(assignment.until);
        setAssignmentAttempts(assignment.attempts);
        setAssignmentPercentage(assignment.percentage);
        setAssignmentPublished(assignment.published);
        setFile(assignment.file); 
    }
}, [assignment]);
  const [loading, setLoading] = useState(false);
  const file_ass = files.find((f:any)=> f.itemId===aid) 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
      const file_ = files.find((f: any) => f.itemId === aid || f._id === assignment?.file);
      if (file_) {
          setFile(file_); 
      }
  }, [files, aid, assignment]);

  const fetchFiles = async () => {
    try {
        const fetchedFiles = await filesClient.fetchFiles();

        if (!Array.isArray(fetchedFiles)) {
            console.error("Invalid response from filesClient.fetchFiles, expected an array but got:", fetchedFiles);
            return;
        }
        dispatch(setFiles(fetchedFiles));
    } catch (error) {
        console.error("Error fetching files:", error);
    }
};
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage("File size must be less than 2MB.");
                setAssignmentFile(null); 
            } else {
                setErrorMessage(null);
                setAssignmentFile(file); 
            }
        }
    };


  const [fileToDelete, setFileToDelete] = useState("")

  const handleDeleteFile = async () => {

    if (file_ass) {
    await filesClient.deleteFile(file_ass._id);
    dispatch(deleteFile(file_ass._id));
    }
  }

  const save = async (published:boolean) => {
    if (loading) return; // Prevent duplicate saves
    setLoading(true); // Disable the button
    let fileId = file;
    if (aid) {
        if (assignmentFile) {
            if (file_ass) {
                await filesClient.deleteFile(file_ass._id);
                dispatch(deleteFile(file_ass._id));
            }
    
            // Upload the new file
            const fileUploadResponse = await filesClient.uploadFile(assignmentFile, aid as string);
            fileId = fileUploadResponse.fileId;
            dispatch(addFile(fileUploadResponse));
        }
        const updatedAssignment = {
            _id: assignment._id,
            title: assignmentName,
            course: cid,
            points: assignmentPoints,
            due_date: assignmentDue,
            available_from: assignmentFrom,
            until: assignmentUntil,
            description: assignmentDescription,
            published: published  ,
            file: "",
            attempts: assignmentAttempts,
            percentage: assignmentPercentage,
        };
        await assignmentsClient.updateAssignment(updatedAssignment);
        dispatch(updateAssignment(updatedAssignment));
    } else {
        const newAssignment = {
            title: assignmentName,
            course: cid,
            points: assignmentPoints,
            due_date: assignmentDue,
            available_from: assignmentFrom,
            until: assignmentUntil,
            description: assignmentDescription,
            published: published,
            file:"",
            attempts: assignmentAttempts,
            percentage: assignmentPercentage,
        };


        const createdAssignment = await coursesClient.createAssignmentForCourse(cid as string, newAssignment);
        dispatch(addAssignment(createdAssignment));


        if (assignmentFile) {
            const fileUploadResponse = await filesClient.uploadFile(assignmentFile, createdAssignment._id);
            dispatch(addFile(fileUploadResponse));

            const newerAssignment = { ...createdAssignment, file: fileUploadResponse.fileId };
            await assignmentsClient.updateAssignment(newerAssignment);
            dispatch(updateAssignment(newerAssignment));
        }

    }

    if (fileToDelete!=="" && !assignmentFile) {
        handleDeleteFile()
    }
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
};

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(assignments));
    };


    const { isStudentView, toggleView } = useViewContext();

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
          await Promise.all([fetchFiles(), fetchAssignments(),]);
          setIsLoading(false);
        };
        fetchData();
      }, []);

      if (isLoading) {
        return <div>Loading...</div>; // Display loading indicator
      }
      
  return (
    <>

            <ProtectedContent><StudentViewButton
              isStudentView={isStudentView}
              onClick={toggleView}
              /></ProtectedContent>


      {isStudentView ? (
      <div className="container-fluid">

    
          <div id="wd-assignments-editor" className="p-5 row">
              <div className="row mb-1 p-1">
                  <label htmlFor="wd-name">Assignment Name</label>
              </div>
              <div className="row mb-2">
                  <input
                      id="wd-name"
                      value={assignmentName}
                      type="text"
                      className="form-control"
                      onChange={(e) => setAssignmentName(e.target.value)}
                  />
              </div>
   
              <div className="row mb-2">
                  <div className="row mb-1 p-1">
                      <label htmlFor="wd-description">Description</label>
                  </div>
                  <div><Editor value={assignmentDescription || ""} onChange={(e) => setAssignmentDescription(e.target.value)}/></div>

              </div>


              <div className="row mb-5">
                  <div className="row mb-1 p-1">
                      <label htmlFor="wd-file">Upload File</label>
                  </div>
                  <input
                      type="file"

                      onChange={handleFileChange}
                      className="form-control mb-2"
                  />
 
            {errorMessage && (
                    <p className="text-danger" style={{ fontSize: "0.875rem" }}>{errorMessage}</p>
                        )}
                
                {file_ass && fileToDelete==="" && !errorMessage ? (
                    <p className="text-muted">
                        {file_ass.originalName
                            ? <>Current file: {`${file_ass.originalName}`} <button className="btn btn-light" onClick={()=>setFileToDelete(file_ass)}><IoMdClose className="text-dark fs-5"/></button></> 
                            : "No file uploaded"}
                    </p>
                ) : (
                    <p className="text-muted">No file uploaded</p>
                )}

            
              </div>


              <div className="row mb-2">
                    <div className="col"style={{textAlign:"right"}}>
                 <label htmlFor="wd-points" className="form-label">Points</label>
                    </div>

                    <div className="col">
                     <input type="text" className="form-control" id="wd-points" defaultValue={assignmentPoints}
                    onChange={(e) => setAssignmentPoints(parseInt(e.target.value))}/>
                    </div>
              </div>

              <div className="row mb-2">
                    <div className="col"style={{textAlign:"right"}}>
                 <label htmlFor="wd-attempts" className="form-label">Attempts</label>
                    </div>

                    <div className="col">
                     <input type="text" className="form-control" id="wd-attempts" defaultValue={assignmentAttempts}
                    onChange={(e) => setAssignmentAttempts(parseInt(e.target.value))}/>
                    </div>
              </div>
              
              <div className="row mb-2">
                    <div className="col"style={{textAlign:"right"}}>
                 <label htmlFor="wd-percentage" className="form-label">Percentage</label>
                    </div>

                    <div className="col">
                     <input type="text" className="form-control" id="wd-points" defaultValue={assignmentPercentage}
                    onChange={(e) => setAssignmentPercentage(parseInt(e.target.value))}/>
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
                          <div className="row"><div className="input-group"><input type="date" name="wd-due-date" id="wd-due-date" className="form-control" value={assignmentDue ? new Date(assignmentDue).toISOString().split("T")[0] : ""}
                          onChange={(e) => setAssignmentDue(new Date (e.target.value))}/></div></div>
                          </li>

                      <li className="list-group-item border-0">
                        <div className="row">
                        <div className="col">
                          <div className="row"><label htmlFor="wd-available-from" className="wd-available-from" style={{fontWeight:"bold"}}>Available From</label></div>
                          <div className="row"><div className="input-group"><input type="date" name="wd-available-from" id="wd-available-from" className="form-control" value={assignmentFrom ? new Date(assignmentFrom).toISOString().split("T")[0] : ""}
                          onChange={(e) => setAssignmentFrom(new Date (e.target.value))}/></div></div>
                          </div>

                          <div className="col">
                          <div className="row"><label htmlFor="wd-available-until" className="wd-available-until" style={{fontWeight:"bold"}}>Until</label></div>
                          <div className="row"><div className="input-group"><input type="date" name="wd-available-until" id="wd-available-until" className="form-control" value={assignmentUntil ? new Date(assignmentUntil).toISOString().split("T")[0] : ""}
                          onChange={(e) => setAssignmentUntil(new Date (e.target.value))}/></div></div>
                          </div>
                          </div>
                          </li>
                      </ul>
                  </div>


              </div>

              <div className="row mt-5 mb-2">
                  <div className="col">
                      <hr />
                      <div className="col">
                          <button onClick={()=>save(true)} className="btn btn-primary float-end rounded-1" type="submit" disabled={loading}> 
                              Save & Publish
                          </button>
                      </div>
                      <div className="col">
                          <button onClick={()=>save(false)} className="btn btn-primary float-end me-2 rounded-1" type="submit" disabled={loading}> 
                              Save
                          </button>
                      </div>

                      <div className="col">
                          <Link to={`/Kanbas/Courses/${cid}/Assignments`}>
                              <button className="btn btn-secondary float-end me-2 rounded-1" type="submit">
                                  Cancel
                              </button>
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>): 
      
      (

        <div className="container-fluid" id="wd-take-quiz">
        
                {assignments && assignments.filter((assignment:any)=>assignment._id === aid)
                .map((a:any)=> (
                    <>
                    <div className="row d-flex">
                    <div className="col-8 me-5 ">
                    <div className="row mb-2">
                        <h4 style={{ fontWeight: "bold" }}> {`${a.title}`} </h4>
                    </div>
        

                    <hr />

                    <div className="row mb-3">
                      <table className="table table-borderless mb-1">
                          <tbody>
                              <tr className="table">
                                  
                                      <div className="details-row">
                                          <div><strong>Due</strong>{`${a.due_date}`.toString().split("T")[0]}</div>
                                          <div><strong>Points</strong>{a.points}</div>
                                          <div><strong>Available</strong>{`${a.available_from}`.toString().split("T")[0]}</div>
                                          
                                      </div>
                                  
                              </tr>

                          </tbody>
                      </table>
                      <hr />
                  </div>
        

                {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Available" &&
                    <>
                    <div className="row ms-1">
                        {a.description}
        
                    </div>

        
                    {file_ass ? (
                    <div className="row">
                      <p>The assignment is
                        <a
                        href={`${REMOTE_SERVER}/api/files/${file_ass._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="ms-2"
                      >
                        {file_ass.originalName}
                      </a></p>
        
                    </div>): null}

                </>}

                {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Not Available Until" &&
                                    <>
                                    <div className="row ms-1">
                                        This assignment is locked until {assignment.available_from.toString().split("T")[0]}
                        
                                    </div>


                </>}
                {calculateAvailability(assignment.due_date, assignment.available_from, assignment.until)==="Closed" &&
                                    <>
                                    <div className="row ms-1">
                                        This assignment is closed
                        
                                    </div>


                </>}

                    
                    
                    </div></div>
                </>))} 

              </div>
      )
      
      }
      </>
  );
}

