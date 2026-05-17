import { useEffect, useState } from "react";
import * as resultsClient from "../Quizzes/resultsClient";
import * as coursesClient from "../client";
import * as usersClient from "../../../Account/client"
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setResults } from "../Quizzes/resultsReducer";
import { setQuizzes } from "../Quizzes/quizzesReducer";
import ProtectedContentEnrollment from "../../../Account/ProtectedContentEnrollment";
import ProtectedContent from "../../../Account/ProtectedContent";
import * as assignmentsResultsClient from "../Assignments/assignmentsResultsClient";
import { setAssignmentResults } from "../Assignments/assignmentResultsReducer";
import { setAssignments } from "../Assignments/reducer";
import { setUsers } from "../../../Account/usersReducer";
import * as enrollmentsClient from "../../Enrollment/client";
import { enroll, setEnrollments } from "../../Enrollment/reducer";

export default function Grades() { 
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate()
    const { users } = useSelector((state:any)=> state.usersReducer)  //users enrolled in the course
    const [isLoading, setIsLoading] = useState(true);
    const {results} = useSelector((state:any)=> state.resultsReducer)
    const {quizzes} = useSelector((state:any) => state.quizzesReducer)
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const {assignmentResults} = useSelector((state:any)=> state.assignmentsResultsReducer)


    const {enrollments} = useSelector((state:any)=>state.enrollmentsReducer)

    const dispatch = useDispatch()


   
    const fetchResults = async () => {
           const results = await resultsClient.fetchResultsByUser(cid as string, currentUser._id)
           dispatch(setResults(results))
        }

    
    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    
        dispatch(setQuizzes(quizzes));

        };

    const fetchUsers = async () => {
        const users = await usersClient.findUsersForCourse(cid as string)
        dispatch(setUsers(users))
        };

    const fetchEnrollments = async () => {
        const enrollments = await enrollmentsClient.findAllEnrollments()
        dispatch(setEnrollments(enrollments))
        };



    const fetchAssignmentsResults = async () => {
        const assignmentsResults = await assignmentsResultsClient.fetchAllAssignmentsResultsByUser(currentUser._id as string)

        dispatch(setAssignmentResults(assignmentsResults))
    }

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string)
        dispatch(setAssignments(assignments))
    }


    

    useEffect(() => {
        // Fetch data and set loading state
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchUsers(), fetchEnrollments(),fetchQuizzes(),fetchAssignments(), fetchAssignmentsResults(),fetchResults()]);
            setIsLoading(false);
        };
        fetchData();
        }, [dispatch, cid, currentUser]);

    if (isLoading) {
        return <div>Loading...</div>; 
        }

    return (
        <div id="wd-grades" className="p-2">

            <ProtectedContent>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Student</th>
                        <th>University ID</th>
                        <th>Email</th>
                        <th>Course Grade</th>
                        <th>Grade Student</th>

                    </tr>
                    </thead>

                    <tbody>
                        {users && users.map((user:any)=>(
                            <>
                            {user && (
                            <tr key={user._id}>
                                <>
                                {user.role === "STUDENT" &&
                               <>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.universityId}</td>
                                <td>{user.email}</td>
                                <td>{enrollments && enrollments.find((e:any)=>e.user===user._id && e.course === cid)?.courseGrade ? enrollments.find((e:any)=>e.user===user._id && e.course === cid)?.courseGrade : "--"}%</td>
                                <td><button className="btn btn-info" onClick={()=>navigate(`/Kanbas/Courses/${cid}/Grades/${user._id}`)}>Grade Student</button></td>
                                </>
                                }</>
                            </tr>
                            )}
                            </>
                        ))}
                    </tbody>
                </table>
                
            </ProtectedContent>


            <ProtectedContentEnrollment>
            
            <h4 style={{background:"lightgrey"}} className="p-2">Assignments</h4>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Due</th>
                    <th>Submitted</th>
                    <th>Weight</th>
                    <th>Score</th>
                </tr>
                </thead>

                <tbody>

                    {assignmentResults && assignmentResults
                    .filter((a:any)=>a.courseId===cid)
                    .map((r:any)=>(
                        <tr key={r.assignmentId}>
                            <td>{assignments && assignments.find((a:any)=>a._id === r.assignmentId && a.course === r.courseId)?.title}</td>
                            <td>{assignments && assignments.find((a:any)=>a._id === r.assignmentId)?.due_date}</td>
                            <td>{r.submitted_date}</td>
                            <td>{assignments && assignments.find((a:any)=>a._id === r.assignmentId)?.percentage ? assignments.find((a:any)=>a._id === r.assignmentId)?.percentage : "-"} %</td>
                            <td><b >{r.score}/{assignments && assignments.find((a:any)=>a._id === r.assignmentId)?.points}</b></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
            <h4 style={{background:"lightgrey"}} className="p-2">Quizzes</h4>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Due</th>
                    <th>Submitted</th>
                    <th>Weight</th>
                    <th>Score</th>
                </tr>
                </thead>

                <tbody>
                    {results && results.map((r:any)=>(
                        <tr key={r.quizId}>
                            <td>{quizzes && quizzes.find((q:any)=>q._id === r.quizId && q.course === r.courseId).title}</td>
                            <td>{quizzes && quizzes.find((q:any)=>q._id === r.quizId).due_date}</td>
                            <td>{r.submitted_date}</td>
                            <td>{quizzes && quizzes.find((q:any)=>q._id === r.quizId).percentage ? quizzes.find((q:any)=>q._id === r.quizId).percentage : "--"} %</td>
                            <td><b >{r.score}/{quizzes && quizzes.find((q:any)=>q._id === r.quizId).points}</b></td>
                        </tr>
                    ))}
   
                </tbody>
            </table>
            
            <div className="ps-2 border mt-5">
                <strong>Current Course Grade:  <span className="fs-3">{enrollments && enrollments.find((e:any)=>e.user===currentUser._id && e.course === cid)?.courseGrade ? enrollments.find((e:any)=>e.user===currentUser._id && e.course === cid)?.courseGrade : "--"}%</span></strong>
            </div>
            </ProtectedContentEnrollment>
            
        </div>
    );
}